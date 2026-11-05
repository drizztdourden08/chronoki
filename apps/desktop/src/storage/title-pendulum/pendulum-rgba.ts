/* @layer renderer-lib @kind logic */
import type { PendulumImage, PendulumTexture } from './title-pendulum.type';
import { M7_TILE_BYTES, M7_TILE_PX } from './title-pendulum.constants';

const expand5 = (value: number): number => (value << 3) | (value >> 2);

const colourIndexAt = (texture: PendulumTexture, x: number, y: number): number => {
  const { tiles, row0, col0, cols } = texture.geometry;
  const tile = texture.map[(Math.floor(y / M7_TILE_PX) - row0) * cols + (Math.floor(x / M7_TILE_PX) - col0)] ?? 0;
  if (tile >= tiles) return 0;
  return texture.chr[tile * M7_TILE_BYTES + (y % M7_TILE_PX) * M7_TILE_PX + (x % M7_TILE_PX)] ?? 0;
};

const paint = (rgba: Uint8ClampedArray, at: number, colour: number): void => {
  rgba[at] = expand5(colour & 0x1f);
  rgba[at + 1] = expand5((colour >> 5) & 0x1f);
  rgba[at + 2] = expand5((colour >> 10) & 0x1f);
  rgba[at + 3] = 0xff;
};

const pendulumRgba = (texture: PendulumTexture): PendulumImage | null => {
  const { row0, col0, cols, rows, pivotX, pivotY } = texture.geometry;
  const [artLeft, artTop] = [col0 * M7_TILE_PX, row0 * M7_TILE_PX];
  const [artRight, artBottom] = [(col0 + cols) * M7_TILE_PX, (row0 + rows) * M7_TILE_PX];
  const half = Math.max(pivotX - artLeft, artRight - pivotX);
  if (pivotY > artTop || half <= 0) return null;
  const [width, height, left] = [half * 2, artBottom - pivotY, pivotX - half];
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let y = artTop; y < artBottom; y += 1) {
    for (let x = artLeft; x < artRight; x += 1) {
      const index = colourIndexAt(texture, x, y);
      if (index) paint(rgba, ((y - pivotY) * width + (x - left)) * 4, texture.palette[index] ?? 0);
    }
  }
  return { width, height, rgba };
};

export { pendulumRgba };
