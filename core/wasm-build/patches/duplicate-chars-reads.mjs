// The duplicate-characters build guard (I-115, design section 5): every read of a party byte ($7E:2980 + i) or a battle
// seat byte ($7E:AEFF + seat) in the engine files duplicate-chars.mjs patches is classified here, by its code (comments
// stripped, whitespace collapsed) and how many times that exact line occurs:
//   'K' = the byte is used as a KIND (looks, attack, techs, growth): duplicate-chars.mjs rewrites the line as
//         `ck_dup_chars() ? <kind> : <original>`, so the line must be gone from the patched copy;
//   'S' = the byte is used as a SLOT (story identity, presence, sheet index, names, swaps): left as it is.
// A new read upstream, a read that moved or changed, or a K line still present after patching stops the build: someone
// must classify it. battle.c and move.c are guarded by duplicate-chars-battle.mjs (P4's own counts), not here.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const READ = /0x(?:2980|AEFF) *\+/i;
const code = (l) => l.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '').replace(/\s+/g, ' ').trim();

// [class, normalized code line, occurrences (default 1)]
const DUP_READS = {
  'ct_vm.c': [
    ['S', 'for (int rsv = 3; rsv < 9; rsv++) m->s[0x2980 + rsv] = 0x80;'],
    ['S', 'return sc->mem->s[0x2980 + slot];'],
  ],
  'world.c': [
    ['K', 'int mg = (ram[0x2980 + B[0x24]] == 6) ? 0x0C : 0;', 2],   // W3/W4: Magus's overworld sprite offset
    ['S', 'if (ram[0x2980 + B[0x24]] & 0x80) return 0;'],
    ['S', 'for (int i = 0; i < 3; i++) if (!(ram[0x2980 + i] & 0x80)) party++;'],
  ],
  'field.c': [
    ['K', 'unsigned id = w->wram[0x2980 + i];'],                         // F5: overworld party graphics (C2/2BBC)
    ['K', 'for (int i = 0; i < 3; i++) OW_MVN7F(0x8D80 + i * 0x20, (uint16_t)(0x8E00 + (w->wram[0x2980 + i] & 0xFF) * 32), 16);'],   // F6: palettes
    ['K', 'if (atk < 0 || atk >= 3 || mem[0x2980 + atk] != 1) return -1;'],   // F1: Marle's attack pose
    ['S', 'if (mem[0x2980 + seat] & 0x80) continue;'],
    ['K', 'int charId = mem[0x2980 + seat] & 7;'],                       // F2: the battle idle stance per character
    ['K', '&& mem[0x2980 + h->actAttacker] == 1) {'],                    // F3: Marle's melee ladder
    ['K', 'if (!h->actActive || atk < 0 || atk >= 3 || mem[0x2980 + atk] != 1) return;'],   // F4: Marle's spark
    ['S', 'if (s[0x2980 + k] & 0x80) continue;'],
    ['S', 'if (w[0x2980 + k] & 0x80) { printf("renderwram: seat%d ABSENT\\n", k); continue; }'],
    ['S', 'int cid = w[0x2980 + k] & 7, rbase = 0x5E2D + k * 0x80;'],
    ['S', 'for (int k = 0; k < 3; k++) if (!(s7[0x2980 + k] & 0x80)) { menuStatSlot = k; break; }'],
    ['S', 'if (!(s7[0x2980 + k] & 0x80)) { menuStatSlot = k; break; }'],
    ['S', 'if (!(s7[0x2980 + menuStatSlot] & 0x80)) break;'],
    ['S', 'int tn = CtMenuTechList(&th, s7[0x2980 + menuStatSlot] & 7, menuTechTab, tt, NULL, NULL, NULL, 64);'],
    ['S', 'menuStatSub = 1; menuStatChar = s7[0x2980 + menuStatSlot] & 7;'],
    ['S', 'int tParty = 0; for (int k = 0; k < 3; k++) if (!(s7[0x2980 + k] & 0x80)) tParty++;'],
    ['S', 'int pid = s7[0x2980 + k] & 7;', 3],
    ['S', 'menuStatChar = s7[0x2980 + menuStatSlot] & 7;', 2],
    ['S', 'for (int k = 0; k < 3; k++) if (!(s7[0x2980 + k] & 0x80)) partyN++;'],
    ['S', 'if (menuStatSub == 0) { portChar = s7[0x2980 + menuStatSlot] & 7; portOk = !(s7[0x2980 + menuStatSlot] & 0x80); }'],
    ['S', 'portChar = s7[0x2980 + fs] & 7; portOk = !(fpp[menuFormSlot] & 0x80) && !(s7[0x2980 + fs] & 0x80);'],
    ['S', 'int rs = fp8[menuFormSlot] & 0x3F, cc = s7[0x2980 + rs] & 7;'],
    ['S', 'menuStatDimSlot, s7[0x0412], s7[0x2980 + menuStatSlot] & 7);'],
    ['S', 'int itPartyN = 0; for (int k = 0; k < 3; k++) if (!(s7[0x2980 + k] & 0x80)) itPartyN++;'],
    ['S', 'if (menuStatSub == 0) { CtMenuRenderTech(&mh, fb, s7[0x2980 + menuStatSlot] & 7, menuTechTab,'],
    ['S', 'CtGetName(s7[0x2980 + (fp9[r] & 0x3F)] & 7), (fp9[r] & 0x40) ? "dim" : "bright");'],
    ['S', 'int cid = s7[0x2980 + (fp9[r] & 0x3F)] & 7, fy, fx, a0, a1, b0, b1;'],
    ['S', 'for (int k = 0; k < 3; k++) if (!(s7[0x2980 + k] & 0x80)) { menuStatSlot = k; break; } }', 2],
    ['S', 'if (menuT == 37) { menuStatSub = 1; menuStatChar = s7[0x2980 + menuStatSlot] & 7; }'],
    ['S', 'if (menuT == 51) { menuStatSub = 1; menuStatChar = s7[0x2980 + menuStatSlot] & 7; }'],
    ['S', 'int tcid = s7[0x2980 + menuStatSlot] & 7;'],
    ['S', 'int pid = s7[0x2980 + q]; if (pid & 0x80) continue;', 2],
  ],
  // menu.c's kind sites key on a charId (= slot) parameter, not on a $2980 read: duplicate-chars.mjs maps them there.
  'menu.c': [
    ['S', 'return (mem && sl >= 0 && sl < 9) ? (mem[0x2980 + sl] & 7) : fallback;'],
    ['S', 'int e = g_charSelMem[0x2980 + sl];'],
    ['S', 'int id = mem[0x2980 + slot];'],
    ['S', 'uint8_t t = mem[0x2980 + a];'],
    ['S', 'mem[0x2980 + a] = mem[0x2980 + b];'],
    ['S', 'mem[0x2980 + b] = t;'],
    ['S', 'uint8_t a = mem[0x2980 + i];', 2],
    ['S', 'if (!(mem[0x2980 + x] & 0x80)) res++;'],
    ['S', 'int pid = mem[0x2980 + tgtSlot];', 2],
    ['S', 'int pid = mem[0x2980 + m];'],
    ['S', 'for (int m = 0; m < 3; m++) { int pid = mem[0x2980 + m]; if (pid & 0x80) continue; mItemApplyOne(mem, idx, pid & 7); }'],
    ['S', 'int pid = mem[0x2980 + (targetSlot & 3)];'],
    ['S', 'if (all) { n = 0; for (int k = 0; k < 3; k++) if (!(mem[0x2980 + k] & 0x80)) n++; i = 0; }'],
    ['S', 'int pid = mem[0x2980 + i];', 2],
    ['S', 'if (fx & 0x08) { n = 0; for (int k = 0; k < 3; k++) if (!(mem[0x2980 + k] & 0x80)) n++; i = 0; }'],
    ['S', 'if (fx & 0x08) { count = 0; for (int k = 0; k < 3; k++) if (!(mem[0x2980 + k] & 0x80)) count++; }'],
    ['S', 'int pid = mem[0x2980 + slot];'],
    ['S', 'int e = h->mem[0x2980 + cell];'],
    ['S', 'int cid = h->mem[0x2980 + (pan[r] & 0x3F)] & 7;'],
    ['S', 'uint8_t a = mem[0x2980 + x];'],
    ['S', 'if (mem[0x2980 + x] & 0x80) continue;', 2],
    ['S', 'int cch = mem[0x2980 + slot];'],
    ['S', 'for (int s2 = 0; s2 < 9; s2++) if (h->mem && (h->mem[0x2980 + s2] & 7) == part[i]'],
    ['S', '&& !(h->mem[0x2980 + s2] & 0x80)) { slot = s2; break; }'],
    ['S', 'for (int s2 = 0; s2 < 3; s2++) if ((h->mem[0x2980 + s2] & 7) == (charId & 7) && !(h->mem[0x2980 + s2] & 0x80)) slot = s2;'],
    ['S', 'mem[0x0D5F + y] = mem[0x2980 + x]; mem[0x0D68 + y] = (uint8_t)x; y++;'],
    ['S', 'int e = mem[0x2980 + x];'],
  ],
};

const readsOf = (text) => {
  const m = new Map();
  for (const l of text.split(/\r?\n/)) {
    const c = code(l);
    if (READ.test(c)) m.set(c, (m.get(c) ?? 0) + 1);
  }
  return m;
};

const countLines = (text, line) => text.split(/\r?\n/).reduce((n, l) => n + (code(l) === line ? 1 : 0), 0);

// `patched`: { 'field.c': text of the patched copy, ... }. Throws on any unclassified, missing or still-present K read.
const checkDuplicateCharReads = (belthasar, patched) => {
  const errors = [];
  for (const [file, table] of Object.entries(DUP_READS)) {
    const found = readsOf(readFileSync(join(belthasar, 'src', file), 'utf8'));
    const known = new Map(table.map(([, line, n]) => [line, n ?? 1]));
    for (const [line, n] of found) {
      if (!known.has(line)) errors.push(`${file}: unclassified $2980/$AEFF read (x${n}): ${line}`);
      else if (known.get(line) !== n) errors.push(`${file}: expected ${known.get(line)} of ${line}, found ${n}`);
    }
    for (const [line] of known) if (!found.has(line)) errors.push(`${file}: classified read no longer upstream: ${line}`);
    const copy = patched?.[file];
    if (copy === undefined) { errors.push(`${file}: no patched copy to check`); continue; }
    for (const [cls, line] of table) {
      if (cls === 'K' && countLines(copy, line) !== 0) errors.push(`${file}: kind read left unpatched: ${line}`);
    }
  }
  if (errors.length) {
    throw new Error(`duplicate-chars guard: ${errors.length} problem(s); classify each read in patches/duplicate-chars-reads.mjs\n  ${errors.join('\n  ')}`);
  }
  return Object.values(DUP_READS).reduce((n, t) => n + t.length, 0);
};

export { DUP_READS, checkDuplicateCharReads };
