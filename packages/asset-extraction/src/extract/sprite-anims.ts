/* @layer shared-asset-extraction @kind logic @source Python sprites._sprite_anim_tables, sprites._anim_set_index, sprites.build_anim, sprites.assembly_frame */
import { byteAt, wordAt } from './bytes/byte-reader';
import type { SpriteHeader } from './sprite-records';
import { SPRITE_META, ANIM_LIMIT, SIZE_TABLE } from './sprite-anims.constants';
import type { AnimTables, AssemblyFrame } from './sprite-anims.type';

const animTablesCache = new WeakMap<Uint8Array, AnimTables>();

const spriteAnimTables = (rom: Uint8Array): AnimTables => {
  const hit = animTablesCache.get(rom);
  if (hit) return hit;
  const p2 = 0x240000 + wordAt(rom, SPRITE_META + 4);
  const p3 = 0x240000 + wordAt(rom, SPRITE_META + 6);
  const tables = {
    fp: Array.from({ length: 194 }, (_, i) => 0x240000 + wordAt(rom, p2 + i * 2)),
    dp: Array.from({ length: 194 }, (_, i) => 0x240000 + wordAt(rom, p3 + i * 2)),
  };
  animTablesCache.set(rom, tables);
  return tables;
};

const animSetIndex = (rom: Uint8Array, spriteIndex: number): number =>
  spriteIndex < 0x100 ? byteAt(rom, 0x24f000 + spriteIndex * 5 + 3) : byteAt(rom, 0x24f600 + (spriteIndex - 256) * 10 + 3);

const nextAnimPointer = (fp: number[], base: number): number => Math.min(...fp.filter((a) => a > base), ANIM_LIMIT);

const buildAnim = (rom: Uint8Array, spriteIndex: number, action: number): [number[], number][] => {
  const { fp, dp } = spriteAnimTables(rom);
  const si = animSetIndex(rom, spriteIndex);
  if (si >= fp.length) return [];
  const base = fp[si] as number;
  const dpf = Math.floor((nextAnimPointer(fp, base) - base) / 4);
  if (dpf <= 0) return [];
  const act = action * 4 >= dpf ? 0 : action;
  const dbase = dp[si] as number;
  const frames: [number[], number][] = [];
  for (let f = 0; f < 32; f += 1) {
    const delay = byteAt(rom, dbase + act * 4 + f);
    if (delay === 0) break;
    frames.push([[0, 1, 2, 3].map((fa) => byteAt(rom, base + fa * dpf + act * 4 + f)), delay]);
  }
  return frames;
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
    for (const slots of [[0, 1], [2, 3]] as const) {
      for (let t = 0; t < tpg; t += 1) {
        for (const s of slots) {
          chips[gs + t * 4 + s] = wordAt(rom, pos);
          pos += 2;
        }
      }
    }
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

export { animSetIndex, assemblyFrame, buildAnim, nextAnimPointer, spriteAnimTables };
export type { AnimTables, AssemblyFrame };
