/* @layer shared-asset-extraction @kind logic */
import type { SpriteHeader } from './sprite-records';
import type { AssemblyFrame } from './sprite-anims.type';
import { SIZE_TABLE } from './sprite-anims.constants';
import { wordAt } from './bytes/word-at';
import { byteAt } from './bytes/byte-reader';

const readGroupChips = (rom: Uint8Array, start: number, group: { tpg: number; gs: number }, chips: number[]): number => {
  const { tpg, gs } = group;
  let pos = start;
  for (const slots of [[0, 1], [2, 3]] as const) {
    for (let t = 0; t < tpg; t += 1) {
      for (const s of slots) {
        chips[gs + t * 4 + s] = wordAt(rom, pos);
        pos += 2;
      }
    }
  }
  return pos;
};

const assemblyFrame = (rom: Uint8Array, asmPtrs: number[], h: SpriteHeader, frame: number): AssemblyFrame => {
  const [groups, tpg] = SIZE_TABLE[h.size & 3] as [number, number];
  const units = groups * tpg;
  const entry = asmPtrs[h.assembly];
  if (entry === undefined) throw new RangeError(`assembly ${h.assembly}`);
  let pos = entry + frame * units * 10;
  const chips: number[] = new Array<number>(units * 4).fill(0);
  for (let g = 0; g < groups; g += 1) {
    const gs = g * tpg * 4;
    pos = readGroupChips(rom, pos, { tpg, gs }, chips);
  }
  const offs: [number, number][] = [];
  for (let u = 0; u < units; u += 1) {
    const ox = byteAt(rom, pos);
    const oy = byteAt(rom, pos + 1);
    pos += 2;
    offs.push([ox >= 128 ? ox - 256 : ox, oy >= 128 ? oy - 256 : oy]);
  }
  return { chips, offs, units };
};

export { assemblyFrame };
