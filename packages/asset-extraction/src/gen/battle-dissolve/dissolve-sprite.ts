/* @layer shared-asset-extraction @kind logic */
import { tile4 } from '../shared/tile-decode';
import { ENEMY_TILES, TILE_ORIGIN } from './dissolve-sprite.constants';

const sprite = (vram: Uint8Array): number[] => {
  const out: number[] = new Array<number>(1024).fill(0);
  for (const t of ENEMY_TILES) {
    const [ox, oy] = TILE_ORIGIN[t] as [number, number];
    const px = tile4(vram, 0, t);
    for (let y = 0; y < 8; y += 1) for (let x = 0; x < 8; x += 1) out[(oy + y) * 32 + ox + x] = px[y * 8 + x] as number;
  }
  return out;
};

export { sprite };
