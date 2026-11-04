/* @layer shared-asset-extraction @kind logic */
import type { Frame } from './frames.type';

const buildPalette = (frames: Frame[]): { pal: number[]; idxmap: Map<number, number> } => {
  const pal: number[] = [];
  const idxmap = new Map<number, number>();
  for (const c of frames.flat(2)) {
    if (!idxmap.has(c)) {
      idxmap.set(c, pal.length);
      pal.push(c);
    }
  }
  return { pal, idxmap };
};

export { buildPalette };
