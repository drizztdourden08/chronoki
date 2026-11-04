/* @layer shared-asset-extraction @kind logic */
import { tile4 } from '../shared/tile-decode';

/** The 16 OBJ tiles of the dying enemy's 32x32 sprite, in the generator's order. */
const ENEMY_TILES = [
  0x60, 0x61, 0x70, 0x71, 0x62, 0x63, 0x72, 0x73, 0x64, 0x65, 0x74, 0x75, 0x66, 0x67, 0x76, 0x77,
];

/** Sprite-local (gx,gy) of each 8x8 subtile's top-left (2x2 cells of 16x16). */
const TILE_ORIGIN: Record<number, [number, number]> = {
  0x60: [0, 0], 0x61: [8, 0], 0x70: [0, 8], 0x71: [8, 8],
  0x62: [16, 0], 0x63: [24, 0], 0x72: [16, 8], 0x73: [24, 8],
  0x64: [0, 16], 0x65: [8, 16], 0x74: [0, 24], 0x75: [8, 24],
  0x66: [16, 16], 0x67: [24, 16], 0x76: [16, 24], 0x77: [24, 24],
};

/** The pixel keys (gy*32+gx) in the order the Python dict holds them (tile order, then y, then x). */
const KEY_ORDER: number[] = [];
for (const t of ENEMY_TILES) {
  const [ox, oy] = TILE_ORIGIN[t] as [number, number];
  for (let y = 0; y < 8; y += 1) for (let x = 0; x < 8; x += 1) KEY_ORDER.push((oy + y) * 32 + ox + x);
}

/** sprite(vram): the 32x32 sprite as a flat array of pixel values, index gy*32+gx. */
const sprite = (vram: Uint8Array): number[] => {
  const out: number[] = new Array(1024).fill(0);
  for (const t of ENEMY_TILES) {
    const [ox, oy] = TILE_ORIGIN[t] as [number, number];
    const px = tile4(vram, 0, t);
    for (let y = 0; y < 8; y += 1) for (let x = 0; x < 8; x += 1) out[(oy + y) * 32 + ox + x] = px[y * 8 + x] as number;
  }
  return out;
};

export { KEY_ORDER, sprite };
