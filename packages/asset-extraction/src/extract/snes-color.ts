
import type { Rgb } from './snes-color.type';


const snes15ToRgb = (word: number): Rgb => {
  const r = word & 0x1f;
  const g = (word >> 5) & 0x1f;
  const b = (word >> 10) & 0x1f;
  return [(r << 3) | (r >> 2), (g << 3) | (g >> 2), (b << 3) | (b >> 2)];
};

export { snes15ToRgb };
export type { Rgb };
