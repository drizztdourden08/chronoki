/* @layer shared-asset-extraction @kind logic */
import type { Frame } from './frames.type';

const toIdx = (fr: Frame, idxmap: Map<number, number>): number[][] =>
  fr.map((row) => row.map((c) => idxmap.get(c) as number));

export { toIdx };
