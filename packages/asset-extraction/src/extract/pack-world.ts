/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from '../ctas/ctas.type';
import type { WorkStore } from '../pipeline/work-store.type';
import { T_NAMEMSG, T_NAMEWIN, T_WINDOW, T_WORLD, T_WORLDINTROSEED, T_WORLDSPR } from './asset-types.constants';
import { byteAt, wordAt } from './lib/byte-reader';
import { createBlobWriter } from './lib/blob-writer';
import type { Packer } from './extract.type';

/** The player object = the block whose handler word is C2/3404, blocks 0x40-strided at $0B30-$1B30; 0 when none. */
const findLead = (w: Uint8Array): number => {
  for (let b = 0x0b30; b < 0x1b30; b += 0x40) if (wordAt(w, b) === 0x3404) return b;
  return 0;
};

/** One world's T_WORLD blob (fmt 5): header, grids, defs, palette, props, triggers, records, char, objects, script, ROM tables, BG3, colour math. */
const worldBlob = (rom: Uint8Array, n: number, w: Uint8Array, v: Uint8Array, objw: Uint8Array): Uint8Array => {
  const lead = findLead(w);
  let posx = lead ? wordAt(w, lead + 0x14) : 0;
  let posy = lead ? wordAt(w, lead + 0x18) : 0;
  if (!(posx > 0 && posx < 1536 && posy > 0 && posy < 1024)) {
    posx = 768;
    posy = 512;
  }
  const nrec = byteAt(w, 0x1b38);
  const out = createBlobWriter();
  out.u8(5);
  out.u8(n);
  out.u16(posx);
  out.u16(posy);
  out.bytes(w.subarray(0x4000, 0x4000 + 6144));
  out.bytes(w.subarray(0x5800, 0x5800 + 6144));
  out.bytes(w.subarray(0x3000, 0x3000 + 2048));
  out.bytes(w.subarray(0x3800, 0x3800 + 2048));
  out.bytes(w.subarray(0x18c00, 0x18c00 + 512));
  out.bytes(w.subarray(0x7000, 0x7000 + 512));
  out.bytes(w.subarray(0x7200, 0x7200 + 3072));
  out.bytes(w.subarray(0x1b9b, 0x1b9b + 16));
  out.u8(nrec);
  out.bytes(w.subarray(0x7e00, 0x7e00 + nrec * 7));
  out.bytes(v.subarray(0x4000, 0x4000 + 28672));
  out.bytes(objw.subarray(0x0b30, 0x1b30));
  out.bytes(w.subarray(0x10400, 0x11a00));
  out.bytes(rom.subarray(0xfe00, 0xff00));
  out.bytes(rom.subarray(0x06f640, 0x06f640 + 128));
  out.bytes(v.subarray(0xe000, 0x10000));
  out.bytes(w.subarray(0x0045, 0x004a));
  return out.toBytes();
};

/** The eight worlds' T_WORLD entries (+ the intro seeds); a world with a missing dump is skipped with a warning. */
const worlds = async (rom: Uint8Array, work: WorkStore, log: (m: string) => void): Promise<CtasEntry[]> => {
  const entries: CtasEntry[] = [];
  for (let n = 0; n < 8; n += 1) {
    const wp = `saves/ow_w${n}.live.wram`;
    const w = await work.readBytes(wp);
    const v = await work.readBytes(`saves/ow_w${n}.live.vram`);
    if (w === null || v === null) {
      log(`  [pack_world] world ${n} dumps missing (${wp}) -- skipping (--navworld / --owforce + --peek to produce)`);
      continue;
    }
    const bak = n === 0 ? await work.readBytes('saves/ow_w0.live.wram.bak') : null;
    entries.push({ type: T_WORLD, id: n, blob: worldBlob(rom, n, w, v, bak ?? w) });
    const iw = (await work.readBytes(`saves/ow_w${n}.intro.wram`)) ?? w;
    const intro = iw.slice(0x0b30, 0x1b30);
    if (intro.length === 0x1000) entries.push({ type: T_WORLDINTROSEED, id: n, blob: intro });
  }
  return entries;
};

const SPRITE_FILES: [string, number][] = [
  ['saves/ow_crono.spr', 0],
  ['saves/ow_gulls.spr', 1],
  ['saves/ow_boat.spr', 2],
  ['saves/ow_balloons.spr', 3],
];

/** extract_assets.pack_world: the overworlds' captured states, the overworld sprite atlases and the window bitmaps. */
const packWorld: Packer = async ({ rom, work, log }) => {
  const entries = await worlds(rom, work, log);
  for (const [path, id] of SPRITE_FILES) {
    const d = await work.readBytes(path);
    if (d !== null) entries.push({ type: T_WORLDSPR, id, blob: d });
    else if (id === 0) log(`  [pack_world] ${path} missing -- run ct.exe --owsprite; the viewers fall back to a marker`);
  }
  for (const [path, type] of [
    ['saves/ct_window.bin', T_WINDOW],
    ['saves/ct_namewin.bin', T_NAMEWIN],
    ['saves/ct_namemsg.bin', T_NAMEMSG],
  ] as [string, number][]) {
    const d = await work.readBytes(path);
    if (d !== null) entries.push({ type, id: 0, blob: d });
  }
  return entries;
};

export { packWorld };
