/* @layer shared-asset-extraction @kind logic @source Python extract_assets._fd_tile_anim_end, extract_assets._fd_obj_slot_ends, extract_assets.rom_tables, extract_assets.table_spans */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { animTables } from './battle-anim';
import { effectTables } from './battle-effect';
import { miscTables } from './battle-misc';
import { smallTables } from './small-tables';
import { recordTables } from './battle-records';
import { stageTables } from './battle-stage';
import { locationTables } from './closure-location';
import { menuTables } from './closure-menu';
import { sequenceTables } from './closure-sequence';
import { partyTables } from './party-tables';
import { spriteTables } from './closure-sprites';
import { worldTables } from './closure-world';
import type { RomTable } from './closure.type';
import type { ClosureInputs } from './rom-tables.type';

const tileAnimSizes = (fc: number): [number, number] => {
  if (fc === 2) return [2, 4];
  if (fc === 4) return [4, 8];
  return [8, 16];
};

const fdTileAnimEnd = (rom: Uint8Array): number => {
  let mx = 0;
  for (let loc = 0; loc < 512; loc += 1) {
    const idx = byteAt(rom, 0x360001 + loc * 14) & 0x3f;
    let x = wordAt(rom, 0x3df290 + idx * 2);
    for (let n = 0; n < 12; n += 1) {
      const t = 0x3df310 + x;
      const fc = byteAt(rom, t);
      mx = Math.max(mx, t);
      x += 1;
      if (fc === 0x80) continue;
      mx = Math.max(mx, 0x3df310 + x + 1);
      x += 2;
      const [first, second] = tileAnimSizes(fc);
      mx = Math.max(mx, 0x3df310 + x + first - 1);
      x += first;
      mx = Math.max(mx, 0x3df310 + x + second - 1);
      x += second;
    }
  }
  return mx + 1;
};

const fdObjSlotEnds = (rom: Uint8Array): [number, number] => {
  let mset = 0;
  let mdesc = 0;
  for (let loc = 0; loc < 512; loc += 1) {
    const ti = (byteAt(rom, 0x360003 + loc * 14) << 1) & 0xff;
    mset = Math.max(mset, 0x3df9c8 + ti);
    let x = wordAt(rom, 0x3df9c7 + ti);
    for (let n = 0; n < 6; n += 1) {
      const d = 0x3dfa77 + x;
      const m = byteAt(rom, d) & 0xf0;
      mdesc = Math.max(mdesc, d);
      if (m === 0) {
        x += 1;
        continue;
      }
      const r0 = byteAt(rom, d);
      x += 3;
      mdesc = Math.max(mdesc, 0x3dfa77 + x);
      x += 1;
      if (m !== 0x10 && m !== 0x80) continue;
      mdesc = Math.max(mdesc, 0x3dfa77 + x + 2);
      x += 3;
      if (m === 0x80) {
        const cnt = (r0 & 0x0f) + 1;
        mdesc = Math.max(mdesc, 0x3dfa77 + x + cnt - 1);
        x += cnt;
      }
    }
  }
  return [mset + 1, mdesc + 1];
};

const romTables = (rom: Uint8Array, inputs: ClosureInputs): RomTable[] => {
  const taEnd = fdTileAnimEnd(rom);
  const [osSetEnd, osDescEnd] = fdObjSlotEnds(rom);
  return [
    ['C0 atan 32x32 (C0/F300)', 0x00f300, 0x00f700],
    ['C0 facing (C0/F700)', 0x00f700, 0x00f800],
    ['C0 sine (C0/F800)', 0x00f800, 0x00f940],
    ['C0 trig step (C0/F900, index (A << 2) & 3FF)', 0x00f900, 0x00fd00],
    ['C0 bit reverse (C0/FD00)', 0x00fd00, 0x00fe00],
    ['C0 noise (C0/FE00, 8-bit index)', 0x00fe00, 0x00ff00],
    ['C0 bit masks (C0/FF20: 01 02 .. 80, the chest flags)', 0x00ff20, 0x00ff28],
    ['C0 window wave (C0/FF30 + 4k + (step & 3E), k < 16)', 0x00ff30, 0x00ffae],
    ['location records (F6:0000, 512 x 14)', 0x360000, 0x360000 + 512 * 14],
    ['FD tile-animation pointers (FD:F290, 64 words)', 0x3df290, 0x3df310],
    ['FD tile-animation program (FD:F310, its closure)', 0x3df310, taEnd],
    ['FD colour-slot sets (FD:F9C7, its closure)', 0x3df9c7, osSetEnd],
    ['FD colour-slot descriptors (FD:FA77, its closure)', 0x3dfa77, osDescEnd],
    ['FF window tiles (FF:9E10, 8 x 0x280)', 0x3f9e10, 0x3f9e10 + 8 * 0x280],
    ['FF text palettes (FF:B210, 8 x 16)', 0x3fb210, 0x3fb290],
    ['FF naming grid (FF:C9AC, 80)', 0x3fc9ac, 0x3fc9fc],
    ...locationTables(rom),
    ...sequenceTables(rom, inputs.lzSkipped),
    ...spriteTables(rom, inputs.lzSkipped),
    ...partyTables(rom),
    ...menuTables(rom),
    ...worldTables(rom),
    ...animTables(rom, inputs.animLens),
    ...stageTables(rom),
    ...recordTables(rom),
    ...effectTables(rom),
    ...smallTables(rom),
    ...miscTables(rom),
  ];
};

const tableSpans = (rom: Uint8Array, inputs: ClosureInputs): [number, number][] => {
  const out: [number, number][] = [];
  const sorted = romTables(rom, inputs).sort((x, y) => x[1] - y[1] || x[2] - y[2]);
  for (const [, a, b] of sorted) {
    if (b <= a) continue;
    const last = out[out.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else out.push([a, b]);
  }
  return out;
};

export { tableSpans };
export type { ClosureInputs };
