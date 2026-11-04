/* @layer shared-asset-extraction @kind logic @source Python rom_closure_battle.stage_cfgs, rom_closure_battle.anim_set_end, rom_closure_battle.stage_tables */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';
import { byteSpans } from './byte-spans';
import { romLabel } from './rom-label';
import type { RomTable } from './closure.type';
import { CD, CE, CC } from './battle-stage.constants';
import type { StageAdd, StageCfg } from './battle-stage.type';
const D1 = 0x110000;

const stageCfgs = (rom: Uint8Array): StageCfg[] => {
  const out: StageCfg[] = [];
  const add = (base: number, { stride, first, d1, t2, t3 }: StageAdd): void => {
    for (let i = 0; i < 256; i += 1) {
      const r = base + stride * i;
      out.push([byteAt(rom, r + first), byteAt(rom, r + first + 1), byteAt(rom, r + first + 2), D1 + d1, t2, t3]);
    }
  };
  for (const [base, t2, t3] of [[CD + 0x5526, CD + 0x6a2c, CD + 0x666e], [CD + 0x5c26, CD + 0x6c2c, CD + 0x656e], [CD + 0x45a6, CD + 0x692c, CD + 0x656e]] as number[][]) {
    add(base as number, { stride: 7, first: 3, d1: 0x60, t2: t2 as number, t3: t3 as number });
  }
  for (const base of [CD + 0x4926, CD + 0x4f26]) add(base, { stride: 6, first: 3, d1: 0x60, t2: CD + 0x6a2c, t3: CD + 0x666e });
  for (const base of [CD + 0x4015, CD + 0x401a, CD + 0x401f]) add(base, { stride: 15, first: 2, d1: 0x0, t2: CD + 0x686e, t3: CD + 0x64b0 });
  return out;
};

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
