/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { ptr24 } from './closure-locations';
import { E4, D1, CD, SPRITE_RECS } from './closure-world.constants';
import { worldStreams } from './world-streams';

const spriteStreams = (rom: Uint8Array): Map<string, Set<number>> => {
  const gfxTable = E4 + u16(rom, E4 + 0xffe0);
  const gfx = new Set<number>();
  for (const [base, stride, count] of SPRITE_RECS) for (let i = 0; i < count; i += 1) gfx.add(rom[base + stride * i] as number);
  const out = new Set<number>();
  for (const i of gfx) {
    const o = ptr24(rom, gfxTable + 3 * i);
    if (o !== null) out.add(o);
  }
  return new Map([['sprite sheets ($E4:FFE0 gfx table)', out]]);
};

const effectFrameStreams = (rom: Uint8Array): Set<number> => {
  const out = new Set<number>();
  const add = (t1: number, idx: number): void => void out.add(D1 + u16(rom, t1 + 2 * idx));
  for (const base of [CD + 0x5526, CD + 0x5c26, CD + 0x45a6]) {
    for (let i = 0; i < 256; i += 1) add(D1 + 0x0060, rom[base + 7 * i + 3] as number);
  }
  for (const base of [CD + 0x4926, CD + 0x4f26]) {
    for (let i = 0; i < 256; i += 1) add(D1 + 0x0060, rom[base + 6 * i + 3] as number);
  }
  for (const base of [CD + 0x4015, CD + 0x401a, CD + 0x401f]) {
    for (let i = 0; i < 256; i += 1) add(D1 + 0x0000, rom[base + 15 * i + 2] as number);
  }
  return out;
};

const stageStreams = (rom: Uint8Array): Map<string, Set<number>> =>
  new Map([['battle effect frames ($D1 words, C1/486A)', effectFrameStreams(rom)]]);

export { spriteStreams, stageStreams };
