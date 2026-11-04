/* @layer shared-asset-extraction @kind logic */
import type { Frame } from './frames.type';
import { H, W } from './frames.constants';

const loadFb = (d: Uint8Array): Frame => {
  const px: Frame = [];
  for (let y = 0; y < H; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < W; x += 1) {
      const o = (2 * y * 512 + 2 * x) * 4;
      row.push(((d[o + 3] as number) << 16) | ((d[o + 2] as number) << 8) | (d[o + 1] as number));
    }
    px.push(row);
  }
  return px;
};

export { loadFb };
