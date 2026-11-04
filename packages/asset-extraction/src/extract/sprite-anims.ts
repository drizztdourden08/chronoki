/* @layer shared-asset-extraction @kind logic @source Python sprites._sprite_anim_tables, sprites._anim_set_index, sprites.build_anim, sprites.assembly_frame */
import { byteAt } from './bytes/byte-reader';
import { spriteAnimTables } from './sprite-anim-tables';
import { animSetIndex } from './anim-set-index';
import { nextAnimPointer } from './next-anim-pointer';
import type { AnimTables, AssemblyFrame } from './sprite-anims.type';

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

export { buildAnim };
export type { AnimTables, AssemblyFrame };
