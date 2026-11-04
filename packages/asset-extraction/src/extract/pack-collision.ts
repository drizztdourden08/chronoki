/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_COLLISION } from './asset-types.constants';
import { createBlobWriter } from './bytes/blob-writer';
import { sceneHeader, sceneProps } from './scene-props';
import type { Packer } from './extract.type';

/** extract_assets.pack_collision: per map [w u8][h u8] + w*h shape bytes + w*h z bytes + w*h mover bytes. */
const packCollision: Packer = ({ rom }) => {
  const entries: CtasEntry[] = [];
  const seen = new Set<number>();
  for (let s = 0; s < 512; s += 1) {
    const h = sceneHeader(rom, s);
    const mi = (h[4] as number) | ((h[5] as number) << 8);
    if (seen.has(mi)) continue;
    seen.add(mi);
    try {
      const p = sceneProps(rom, s);
      const w = createBlobWriter();
      w.u8(p.w & 0xff);
      w.u8(p.h & 0xff);
      for (const c of p.coll) w.u8(c & 0xff);
      p.zplane.forEach((z, i) => w.u8(((z & 3) | (((p.zflags[i] as number) & 0x3f) << 2)) & 0xff));
      for (const m of p.mover) w.u8(m & 0xff);
      entries.push({ type: T_COLLISION, id: mi, blob: w.toBytes() });
    } catch {
      continue;
    }
  }
  return entries;
};

export { packCollision };
