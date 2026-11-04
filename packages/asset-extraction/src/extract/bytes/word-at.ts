/* @layer shared-asset-extraction @kind logic */
import { byteAt } from './byte-reader';

const wordAt = (data: ArrayLike<number>, i: number): number => byteAt(data, i) | (byteAt(data, i + 1) << 8);

export { wordAt };
