/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../lib/byte-reader';
import { byteSpans, romLabel } from './byte-spans';
import type { RomTable } from './closure.type';

const CD = 0x0d0000;
const CE = 0x0e0000;
const CC = 0x0c0000;
const D1 = 0x110000;

/** [$987E index, $9881 index, $9884 index, D1 word table, CD word table, CE word table]. */
type StageCfg = [number, number, number, number, number, number];

/** rom_closure_battle.stage_cfgs: every (987E, 9881, 9884) triple a config can stage, with the word tables it reads them through. */
const stageCfgs = (rom: Uint8Array): StageCfg[] => {
  const out: StageCfg[] = [];
  const add = (base: number, stride: number, first: number, d1: number, t2: number, t3: number): void => {
    for (let i = 0; i < 256; i += 1) {
      const r = base + stride * i;
      out.push([byteAt(rom, r + first), byteAt(rom, r + first + 1), byteAt(rom, r + first + 2), D1 + d1, t2, t3]);
    }
  };
  for (const [base, t2, t3] of [[CD + 0x5526, CD + 0x6a2c, CD + 0x666e], [CD + 0x5c26, CD + 0x6c2c, CD + 0x656e], [CD + 0x45a6, CD + 0x692c, CD + 0x656e]] as number[][]) {
    add(base as number, 7, 3, 0x60, t2 as number, t3 as number);
  }
  for (const base of [CD + 0x4926, CD + 0x4f26]) add(base, 6, 3, 0x60, CD + 0x6a2c, CD + 0x666e);
  for (const base of [CD + 0x4015, CD + 0x401a, CD + 0x401f]) add(base, 15, 2, 0x0, CD + 0x686e, CD + 0x64b0);
  return out;
};

/** rom_closure_battle.anim_set_end: C1/48EC's walk of the CE animation set at `x` (4-byte records, 16 animations). */
const animSetEnd = (rom: Uint8Array, start: number): number => {
  let x = start;
  let anim = 0;
  for (let i = 0; i < 0x4000; i += 1) {
    const b = byteAt(rom, CE + (x & 0xffff)) & 0xe0;
    if (!b || (b & 0x40 && !(b & 0x80))) {
      x += 4;
      continue;
    }
    x += 4;
    anim += 1;
    if (anim === 0x10) break;
    x += 4;
  }
  return x;
};

/** rom_closure_battle.stage_tables: the anim config tables, the words they stage and the data those name. */
const stageTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [
    ['PC tech anim configs ($CD:45A6, 7 x 256)', CD + 0x45a6, CD + 0x45a6 + 7 * 256],
    ['enemy tech anim configs ($CD:5526, 7 x 256)', CD + 0x5526, CD + 0x5526 + 7 * 256],
    ['item anim configs ($CD:5C26, 7 x 256)', CD + 0x5c26, CD + 0x5c26 + 7 * 256],
    ['enemy physical anim records ($CD:4926 / 4F26, 6 x 256)', CD + 0x4926, CD + 0x4f26 + 6 * 256],
    ['PC physical anim records ($CD:4015, 15 x 256)', CD + 0x4015, CD + 0x401f + 15 * 256],
  ];
  const seen = new Set<number>();
  const word = (at: number): void => void (seen.add(at), seen.add(at + 1));
  for (const [e7e, e81, e84, t1, t2, t3] of stageCfgs(rom)) {
    word(t1 + 2 * e7e);
    word(t2 + 2 * e81);
    word(t3 + 2 * e84);
    const w2 = wordAt(rom, t2 + 2 * e81);
    const w3 = wordAt(rom, t3 + 2 * e84);
    for (let k = 0; k < 512; k += 1) seen.add(CD + ((w2 + k) & 0xffff));
    const end = animSetEnd(rom, w3);
    for (let x = w3; x < end; x += 1) seen.add(CE + (x & 0xffff));
  }
  for (const [a, b] of byteSpans(seen)) out.push([`anim staging words and their data ${romLabel(a)}`, a, b]);
  out.push(
    ['anim palettes, three colours ($D1:4100, 6 x 256)', D1 + 0x4100, D1 + 0x4100 + 6 * 256],
    ['anim palettes, seven colours ($D1:4400, 14 x 256)', D1 + 0x4400, D1 + 0x4400 + 14 * 256],
    ['anim op 7C / 7D sounds ($CD:6D4C, $CD:6DAC, the weapon 8-bit)', CD + 0x6d4c, CD + 0x6dac + 256],
    ['anim speed and rate ($CC:F4BC, $CC:F5BC, ops 08-0F)', CC + 0xf4bc, CC + 0xf4bc + 8],
    ['anim speed and rate ($CC:F5BC)', CC + 0xf5bc, CC + 0xf5bc + 8],
  );
  return out;
};

export { stageTables };
