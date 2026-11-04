/* @layer shared-asset-extraction @kind logic */
import { H, W } from './frames.constants';

const diffBbox = (a: number[][], b: number[][]): [number, number, number, number] | null => {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if ((a[y] as number[])[x] !== (b[y] as number[])[x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }
  }
  return x1 < 0 ? null : [x0, x1, y0, y1];
};

export { diffBbox };
