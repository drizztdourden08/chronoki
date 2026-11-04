// Randomizer P0 spike (docs/plans/randomizer-p0-overlay-spike.md): can a seed be applied as byte edits to a COPY of the
// player's pack, with the engine untouched? It copies the pack in memory, swaps one chest's item and the gift operands of
// one location's script (guarded, all or nothing), boots the headless core on the copy, loads a field save state, opens
// the chest and reads $7E:2400 and the chest's opened bit at $7F:0001+ through CkWramPtr.
//   node core/wasm-build/spikes/overlay-spike.mjs --pack <ct_assets.dat> --state <field state .sav|CKST>
//        [--gift-state <.sav> --gift-inputs "A,90,A,90"] [--chest-item 0xD7] [--gift-item 0xDA] [--glue <chronoki.js>]
// Reads the player's own pack and state at run time; holds no game data. Throwaway: delete when P3's overlay lands.
// Exit: 0 all pass, 1 a check failed, 2 setup error, 3 chest and guard pass but the gift was not checked.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.execArgv.includes('--experimental-wasm-jspi')) {
  const r = spawnSync(process.execPath, ['--experimental-wasm-jspi', fileURLToPath(import.meta.url), ...process.argv.slice(2)], { stdio: 'inherit', windowsHide: true });
  process.exit(r.status ?? 1);
}

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..', '..');
const arg = (name, fallback = null) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : fallback; };
const num = (v) => (v === null ? null : Number(v));
const out = (o) => console.log(JSON.stringify({ spike: 'overlay', ...o }));
const die = (msg) => { out({ setup: 'error', msg }); process.exit(2); };
const hex = (v, w = 2) => `0x${v.toString(16).toUpperCase().padStart(w, '0')}`;

// asset types (Belthasar src/assets.h) and the facts the engine reads (field.c 6043-6102, ct_vm.c 49-77, 1618)
const T_SCENE_HEADER = 3, T_SCRIPT = 16, T_LZ = 36, T_TABLE = 37;
const TREAS_TAB = 0x35f000, TREAS_BANK = 0x350000;
const INV_IDS = 0x2400, INV_CNT = 0x2500, INV_SLOTS = 0xf2, CHEST_BITS = 0x10001;
const BTN_A = 1 << 8;
const CANDIDATES = [0xd7, 0xd8, 0xda, 0xdb, 0xdc, 0xde, 0xdf, 0xe0, 0xe2, 0xe3];
const OPLEN = [
  1,1,3,3,3,3,3,3,1,1,2,2,2,2,2,1, 2,2,5,6,5,5,5,1,3,2,3,1,2,1,2,2, 2,4,4,3,3,2,2,3,3,2,1,1,3,2,1,3, 2,2,1,2,2,2,2,2,2,2,3,2,2,3,3,2,
  2,2,2,2,2,3,3,1,5,5,5,6,5,5,1,3, 4,3,3,4,4,2,4,1,4,4,2,3,1,3,3,3, 4,3,1,3,3,3,3,3,1,3,1,3,1,1,5,3, 3,2,2,2,3,2,2,2,3,1,4,5,2,2,1,2,
  2,2,2,3,2,1,1,2,1,2,2,3,3,5,2,2, 1,1,3,1,2,2,3,3,3,3,4,1,3,3,2,2, 3,3,1,1,1,1,2,2,2,2,2,2,2,2,1,1, 1,1,1,1,1,2,2,3,4,1,1,2,1,1,1,1,
  3,2,2,3,3,2,1,2,2,3,2,2,4,3,3,3, 2,2,3,2,2,3,2,3,3,7,1,1,5,5,5,5, 5,5,5,2,8,8,5,3,2,1,2,3,4,1,1,1, 2,1,1,1,2,1,1,1,1,1,1,1,1,2,18,1,
];
const opLen = (b, o) => {
  const op = b[o], w = (k) => (b[o + k] ?? 0) | ((b[o + k + 1] ?? 0) << 8);
  if (op === 0x4e) return 4 + w(4);
  if (op === 0x2e) { const c = b[o + 1]; return c & 0x40 ? 6 : c & 0x80 ? 3 + w(3) : 2; }
  if (op === 0x88) { const c = b[o + 1]; if (c === 0) return 2; if (c === 0x20 || c === 0x30) return 4; if (c >= 0x40 && c < 0x60) return 5; if (c >= 0x80 && c < 0x90) return 2 + w(2); return 2; }
  if (op === 0xf1) return b[o + 1] === 0 ? 2 : 3;
  if (op === 0xff) return b[o + 1] === 0x90 || b[o + 1] === 0x97 ? 5 : 2;
  if (op === 0xcd || op === 0xce) return 3;
  if (op === 0xcc) return 4;
  return OPLEN[op];
};

// ---- the pack (CTAS: magic, u32 version, u32 count, 16-byte entries {type, id, offset, length}; assets.c 11-35)
const u16 = (d, o) => d[o] | (d[o + 1] << 8);
const u32 = (d, o) => (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0;
const readDir = (d) => {
  if (String.fromCharCode(...d.subarray(0, 4)) !== 'CTAS') die('the pack is not a CTAS container');
  const n = u32(d, 8), dir = [];
  for (let i = 0; i < n; i++) { const e = 12 + i * 16; dir.push({ type: u32(d, e), id: u32(d, e + 4), off: u32(d, e + 8), len: u32(d, e + 12) }); }
  return dir;
};
const entry = (dir, type, id) => dir.find((e) => e.type === type && e.id === id) ?? null;
const tablesAt = (dir, rom, n = 1) => dir.filter((e) => e.type === T_TABLE && rom >= e.id && rom + n <= e.id + e.len);
const romByte = (d, dir, rom) => { const t = tablesAt(dir, rom)[0]; if (!t) die(`no table in the pack covers ROM ${hex(rom, 6)}`); return d[t.off + rom - t.id]; };
const romWord = (d, dir, rom) => romByte(d, dir, rom) | (romByte(d, dir, rom + 1) << 8);

// ---- the overlay: {asset, offset, old, new} edits, every old byte checked before any byte is written (whole or nothing)
const romEdit = (d, dir, rom, bytes, why) => {
  const ts = tablesAt(dir, rom, bytes.length);
  if (!ts.length) die(`no table covers ${hex(rom, 6)} (${why})`);
  return ts.map((t) => ({ asset: { type: T_TABLE, id: t.id }, offset: rom - t.id, old: [...d.subarray(t.off + rom - t.id, t.off + rom - t.id + bytes.length)], new: bytes, why }));
};
const applyOverlay = (pack, edits) => {
  const copy = Uint8Array.from(pack), dir = readDir(copy);
  const at = edits.map((e) => {
    const en = entry(dir, e.asset.type, e.asset.id);
    if (!en || e.offset + e.old.length > en.len) throw new Error(`overlay refused: asset ${e.asset.type}/${hex(e.asset.id, 6)} missing or short (${e.why})`);
    const p = en.off + e.offset;
    if (e.old.some((b, k) => copy[p + k] !== b)) throw new Error(`overlay refused: ${e.why} expects ${e.old.map((b) => hex(b)).join(' ')} at ${e.asset.type}/${hex(e.asset.id, 6)}+${hex(e.offset, 4)}`);
    return p;
  });
  edits.forEach((e, i) => copy.set(e.new, at[i]));
  return copy;
};

// ---- a save state: a PKSV slot (brock-port-kit decode-save-slot.ts) or a raw CKST v2 (core/reconnect/ck_state_box.c)
const readState = (path) => {
  let b = new Uint8Array(readFileSync(path));
  if (String.fromCharCode(...b.subarray(0, 4)) === 'PKSV') b = b.subarray(9 + u32(b, 5));
  if (String.fromCharCode(...b.subarray(0, 4)) !== 'CKST' || u32(b, 4) !== 2) die(`${path}: not a CKST v2 state`);
  const sec = {};
  for (let i = 0, at = 12; i < u32(b, 8); i++) { const n = u32(b, at + 8); sec[String.fromCharCode(...b.subarray(at, at + 4))] = b.subarray(at + 12, at + 12 + n); at += 12 + n; }
  if (!sec.CORE || !sec.HOST || !sec.SCEN) die(`${path}: not a field state (CORE, HOST and SCEN needed)`);
  const host = {}, h = sec.HOST, dv = new DataView(h.buffer, h.byteOffset, h.byteLength);
  for (let at = 0; at < h.length;) {
    const n = h[at], name = String.fromCharCode(...h.subarray(at + 1, at + 1 + n)), size = u32(h, at + 1 + n), v = at + 5 + n;
    if (size === 8 && (name === 'px' || name === 'py')) host[name] = dv.getFloat64(v, true);
    if (size === 4 && (name === 'pfac' || name === 'scene')) host[name] = dv.getInt32(v, true);
    at = v + size;
  }
  return { bytes: Uint8Array.from(b), core: sec.CORE, host, loc: host.scene ?? (u16(sec.CORE, 0x100) & 0x1ff) };
};

// ---- chest: the record the engine would open for the state's facing (fieldTreasureList / fieldTreasureProbe)
const treasure = (d, dir, loc) => {
  const tp = (i) => romWord(d, dir, TREAS_TAB + i * 2);
  let beg = tp(loc), end = tp(loc + 1);
  for (let g = 0; g < 4 && end > beg && romWord(d, dir, TREAS_BANK + beg) === 0; g++) { const a = romWord(d, dir, TREAS_BANK + beg + 2); beg = tp(a); end = tp(a + 1); }
  const recs = [];
  for (let off = beg; off + 4 <= end && recs.length < 16; off += 4) recs.push({ off, tile: romWord(d, dir, TREAS_BANK + off), pay: romWord(d, dir, TREAS_BANK + off + 2), idx: (off - tp(0)) / 4 });
  return { recs, beg, end };
};
const faced = (host) => {
  const tx = (Math.trunc(host.px * 16) >> 8) & 0xff, ty = (Math.trunc(host.py * 16) >> 8) & 0xff, f = host.pfac & 3;
  const t = (x, y) => ((y & 0xff) << 8) | (x & 0xff);
  return f === 0 ? [t(tx, ty - 1), t(tx, ty - 2)] : f === 1 ? [t(tx, ty + 1)] : f === 2 ? [t(tx - 1, ty)] : [t(tx + 1, ty)];
};
const opened = (core, idx) => (core[CHEST_BITS + ((idx >> 3) & 0x3f)] >> (idx & 7)) & 1;
const le16 = (v) => [v & 0xff, (v >> 8) & 0xff];

const planChest = (d, dir, st, item) => {
  if (st.loc <= 0 || st.loc > 510) die(`chest: location ${st.loc} cannot be used`);
  const want = faced(st.host);
  let { recs, beg } = treasure(d, dir, st.loc), mode = 'real', edits = [];
  let rec = recs.find((r) => r.tile === want[0]) ?? recs.find((r) => want[1] !== undefined && r.tile === want[1]);
  if (!rec && !recs.length) {   // no record here: borrow the record just before this location's range (its pointer moves back 4)
    let back = beg - 4;
    while (back > 0 && romWord(d, dir, TREAS_BANK + back) === 0) back -= 4;
    edits.push(...romEdit(d, dir, TREAS_TAB + st.loc * 2, le16(back), `chest: loc ${st.loc} pointer -> ${hex(back, 4)}`));
    recs = [{ off: back, tile: romWord(d, dir, TREAS_BANK + back), pay: romWord(d, dir, TREAS_BANK + back + 2), idx: (back - romWord(d, dir, TREAS_TAB)) / 4 }];
    mode = 'borrowed';
  }
  if (!rec) {   // not facing a chest: move one unopened record onto the faced tile (spike shortcut, never a P3 edit)
    rec = recs.find((r) => !opened(st.core, r.idx)) ?? recs[0];
    edits.push(...romEdit(d, dir, TREAS_BANK + rec.off, le16(want[0]), `chest: record ${rec.idx} tile -> ${hex(want[0], 4)}`));
    if (mode === 'real') mode = 'relocated';
  }
  edits.push(...romEdit(d, dir, TREAS_BANK + rec.off + 2, le16(item), `chest: record ${rec.idx} payload ${hex(rec.pay, 4)} -> ${hex(item, 4)}`));
  return { rec, mode, edits, vanillaItem: rec.pay & 0xc000 ? null : rec.pay & 0x1ff, clearBit: opened(st.core, rec.idx) === 1 };
};

// ---- gift: every op 0xCA (add item, `CA ii`) in the location's script, walked like ct_vm.c 3734-3745
const planGift = (d, dir, loc, item) => {
  const hdr = entry(dir, T_SCENE_HEADER, loc);
  if (!hdr) die(`gift: no scene header for location ${loc}`);
  const si = u16(d, hdr.off + 8), sc = entry(dir, T_SCRIPT, si);
  if (!sc) die(`gift: no script ${si} for location ${loc}`);
  const raw = d.subarray(sc.off, sc.off + sc.len), header = raw[0] * 32, body = raw.subarray(1 + header);
  const starts = [...new Set(Array.from({ length: raw[0] * 16 }, (_, k) => u16(raw, 1 + k * 2) - header))].filter((a) => a >= 0 && a < body.length).sort((a, b) => a - b);
  const gifts = new Map();
  starts.forEach((a0, k) => {
    for (let a = a0, end = starts[k + 1] ?? body.length; a < end;) {
      const n = opLen(body, a);
      if (!n || a + n > body.length) break;
      if (body[a] === 0xca) gifts.set(1 + header + a + 1, body[a + 1]);
      a += n;
    }
  });
  const lz = dir.filter((e) => e.type === T_LZ && e.len === sc.len + 12 && Buffer.compare(d.subarray(e.off + 12, e.off + e.len), raw) === 0);
  const edits = [];
  for (const [at, old] of gifts) {
    if (old === item) continue;
    edits.push({ asset: { type: T_SCRIPT, id: si }, offset: at, old: [old], new: [item], why: `gift: script ${si} +${hex(at, 4)} item ${hex(old)} -> ${hex(item)}` });
    for (const e of lz) edits.push({ asset: { type: T_LZ, id: e.id }, offset: 12 + at, old: [old], new: [item], why: `gift: LZ copy ${hex(e.id, 6)} of script ${si}` });
  }
  return { si, gifts: [...gifts].map(([at, old]) => ({ at, old })), edits, copies: 1 + lz.length, raw };
};

// ---- the engine
const glue = [arg('--glue'), join(root, 'core/wasm-build/out/chronoki.js'), join(root, '../../../core/wasm-build/out/chronoki.js'), join(root, 'apps/desktop/public/wasm/chronoki.js')].find((p) => p && existsSync(p));
const packPath = arg('--pack'), statePath = arg('--state');
if (!glue) die('no built core: pass --glue <chronoki.js>');
if (!packPath || !statePath) die('usage: --pack <ct_assets.dat> --state <field state> [--gift-state <state> --gift-inputs "A,90,A,90"]');
const vanilla = new Uint8Array(readFileSync(packPath)), vdir = readDir(vanilla);
const st = readState(statePath), gst = arg('--gift-state') ? readState(arg('--gift-state')) : null;
const held = (core) => new Set([...core.subarray(INV_IDS, INV_IDS + INV_SLOTS)].filter((v) => v));
const free = CANDIDATES.filter((v) => !held(st.core).has(v) && !(gst && held(gst.core).has(v)));
const chestItem = num(arg('--chest-item')) ?? free[0], giftItem = num(arg('--gift-item')) ?? free.find((v) => v !== chestItem);
if (chestItem === undefined || giftItem === undefined) die('no free candidate item: pass --chest-item and --gift-item');

const chest = planChest(vanilla, vdir, st, chestItem);
const gift = planGift(vanilla, vdir, (gst ?? st).loc, giftItem);
const edits = [...chest.edits, ...gift.edits];
out({ step: 'plan', glue, loc: st.loc, coreLoc: u16(st.core, 0x100) & 0x1ff, host: st.host, chest: { mode: chest.mode, idx: chest.rec.idx, tile: hex(chest.rec.tile, 4), payload: hex(chest.rec.pay, 4), item: hex(chestItem), clearBit: chest.clearBit },
  gift: { loc: (gst ?? st).loc, script: gift.si, ops: gift.gifts.map((g) => `${hex(g.at, 4)}:${hex(g.old)}`), item: hex(giftItem), copies: gift.copies }, edits: edits.length });
for (const e of edits) out({ edit: e.why, asset: `${e.asset.type}/${hex(e.asset.id, 6)}`, offset: hex(e.offset, 4), old: e.old.map((b) => hex(b)).join(' '), new: e.new.map((b) => hex(b)).join(' ') });

// guard self-test: one wrong old byte must refuse the whole overlay and leave the copy untouched
let guard = 'FAIL';
try { applyOverlay(vanilla, [...edits, { ...edits[0], old: edits[0].old.map((b) => b ^ 0xff), why: 'guard self-test' }]); } catch (e) { guard = /overlay refused/.test(e.message) ? 'PASS' : 'FAIL'; }
const pack = applyOverlay(vanilla, edits);
const sha = (b) => createHash('sha256').update(b).digest('hex').slice(0, 16);
out({ step: 'overlay', guard, vanillaSha: sha(vanilla), overlaySha: sha(pack), vanillaUnchanged: sha(vanilla) === sha(new Uint8Array(readFileSync(packPath))) });

const errs = [];
let stopped = null;
const options = {
  print: (s) => { if (/chest/.test(s)) out({ engine: s }); },
  printErr: (s) => { errs.push(s); if (/chest|FAIL|abort/i.test(s)) out({ engineErr: s }); },
  onExit: (c) => { stopped = c ?? 0; }, onAbort: (w) => { stopped = `abort: ${w}`; },
  preRun: [() => {
    options.ENV.CT_CHESTDBG = '1';
    options.FS.writeFile('/ct_assets.dat', pack);
    options.FS.writeFile('/ct_settings.ini', '');
    options.FS.mkdir('/saves');
  }],
};
const m = await createRequire(import.meta.url)(glue)(options);
const tick = () => new Promise((r) => setTimeout(r, 0));
const frames = async (n, input = 0) => { m._CkSetInput(input); for (let i = 0; i < n && stopped === null; i++) { m._CkRunFrame(); await tick(); } m._CkSetInput(0); };
const wram = () => { const p = m._CkWramPtr(); return p ? m.HEAPU8.subarray(p, p + 0x20000) : null; };
const inv = () => { const w = wram(), r = new Map(); for (let i = 0; i < INV_SLOTS; i++) if (w[INV_IDS + i]) r.set(w[INV_IDS + i], w[INV_CNT + i]); return r; };
const finish = (code) => { if (stopped === null) m._CkStop(); process.exit(code); };

const loadState = async (s) => {
  for (let i = 0; i < 2400 && !m._CkStateAvailable() && stopped === null; i++) await frames(1);
  if (!m._CkStateAvailable()) { out({ setup: 'error', msg: 'the core never reached a mode that takes a state', stopped, lastErr: errs.slice(-5) }); finish(2); }
  for (let attempt = 0; attempt < 3; attempt++) {
    const p = m._CkStateInput(s.bytes.length);
    m.HEAPU8.set(s.bytes, p);
    if (!m._CkStateLoad(p, s.bytes.length)) { out({ setup: 'error', msg: 'state refused', reason: m._CkStateReason() }); finish(2); }
    for (let i = 0; i < 600 && m._CkStateStatus() === 1; i++) await frames(1);
    if (m._CkStateStatus() === 2) { await frames(30); return; }
    out({ step: 'load-retry', status: m._CkStateStatus(), reason: m._CkStateReason() });
    await frames(60);
  }
  out({ setup: 'error', msg: 'state did not load' }); finish(2);
};

// chest
await loadState(st);
let w = wram();
const bitAt = (idx) => (wram()[CHEST_BITS + ((idx >> 3) & 0x3f)] >> (idx & 7)) & 1;
if (chest.clearBit) w[CHEST_BITS + ((chest.rec.idx >> 3) & 0x3f)] &= ~(1 << (chest.rec.idx & 7));
const before = inv(), bitBefore = bitAt(chest.rec.idx), bitsBefore = Uint8Array.from(w.subarray(CHEST_BITS, CHEST_BITS + 0x40));
out({ step: 'chest-ready', loc: u16(w, 0x100) & 0x1ff, boxBusy: w[0x0129], control: w[0x011f], bit: bitBefore, has: before.get(chestItem) ?? 0 });
await frames(6, BTN_A);
await frames(120);
w = wram();
const after = inv(), bitAfter = bitAt(chest.rec.idx);
const otherBits = [...w.subarray(CHEST_BITS, CHEST_BITS + 0x40)].reduce((n, v, i) => n + ((v ^ bitsBefore[i]) !== 0 && i !== ((chest.rec.idx >> 3) & 0x3f) ? 1 : 0), 0);
const gained = (after.get(chestItem) ?? 0) - (before.get(chestItem) ?? 0);
const vanillaGained = chest.vanillaItem ? (after.get(chest.vanillaItem) ?? 0) - (before.get(chest.vanillaItem) ?? 0) : 0;
const chestPass = gained === 1 && bitBefore === 0 && bitAfter === 1 && vanillaGained <= 0 && otherBits === 0;
out({ step: 'chest', result: chestPass ? 'PASS' : 'FAIL', item: hex(chestItem), gained, bit: `${bitBefore}->${bitAfter}`, vanillaItem: chest.vanillaItem === null ? null : hex(chest.vanillaItem), vanillaGained, otherBitBytes: otherBits });

// gift: the scene's private script copy is the pack's (structural), and with --gift-state the gift awards (behavioural)
let giftResult = 'SKIP';
if (gift.edits.length) {
  if (gst) await loadState(gst);
  const first = gift.gifts.find((g) => g.old !== giftItem);
  const lo = Math.max(0, first.at - 12), win = Uint8Array.from(gift.raw.subarray(lo, first.at + 12));
  const winOld = Uint8Array.from(win);
  win[first.at - lo] = giftItem;
  const count = (needle) => { const h = Buffer.from(m.HEAPU8.buffer, m.HEAPU8.byteOffset, m.HEAPU8.byteLength); let n = 0; for (let i = h.indexOf(needle); i >= 0; i = h.indexOf(needle, i + 1)) n++; return n; };
  const edited = count(win), old = count(winOld);
  const struct = edited >= gift.copies + 1;
  out({ step: 'gift-struct', result: struct ? 'PASS' : 'FAIL', editedCopies: edited, packCopies: gift.copies, vanillaCopies: old });
  giftResult = struct ? 'STRUCT-PASS' : 'FAIL';
  if (gst && struct) {
    const g0 = inv();
    for (const t of (arg('--gift-inputs') ?? 'A,120,A,120,A,120,A,120,A,240').split(',')) {
      if (/^\d+$/.test(t)) await frames(Number(t)); else await frames(6, { A: BTN_A, B: 1, START: 1 << 3, UP: 1 << 4, DOWN: 1 << 5, LEFT: 1 << 6, RIGHT: 1 << 7 }[t.toUpperCase()] ?? 0);
    }
    const g1 = inv(), got = (g1.get(giftItem) ?? 0) - (g0.get(giftItem) ?? 0);
    const vanillaGot = gift.gifts.filter((g) => g.old !== giftItem).reduce((n, g) => n + Math.max(0, (g1.get(g.old) ?? 0) - (g0.get(g.old) ?? 0)), 0);
    giftResult = got >= 1 && vanillaGot === 0 ? 'PASS' : 'FAIL';
    out({ step: 'gift', result: giftResult, item: hex(giftItem), gained: got, vanillaGained: vanillaGot });
  }
} else out({ step: 'gift', result: 'SKIP', msg: `location ${(gst ?? st).loc} script ${gift.si} has no op 0xCA; pass --gift-state from a location with a gift` });

const all = chestPass && guard === 'PASS';
console.log(`RESULT chest=${chestPass ? 'PASS' : 'FAIL'} gift=${giftResult} guard=${guard}`);
finish(!all || giftResult === 'FAIL' ? 1 : giftResult === 'SKIP' ? 3 : 0);
