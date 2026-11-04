/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/u16';
import { D1, CD } from './closure-world.constants';

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

export { effectFrameStreams };
