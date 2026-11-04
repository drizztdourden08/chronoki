/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { ptr24 } from './closure-locations';
import { E4, SPRITE_RECS } from './closure-world.constants';

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

export { spriteStreams };
