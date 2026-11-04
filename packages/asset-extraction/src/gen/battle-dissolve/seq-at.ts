/* @layer shared-asset-extraction @kind logic */
import type { Seq } from './dissolve-measure.type';

const at = (seq: Seq, n: number): number[] => seq.get(n) as number[];

export { at };
