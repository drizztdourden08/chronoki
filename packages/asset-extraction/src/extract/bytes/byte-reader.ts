/* @layer shared-asset-extraction @kind logic */
import { RomIndexError } from './rom-index-error';

const byteAt = (data: ArrayLike<number>, i: number): number => {
  const v = data[i];
  if (v === undefined) throw new RomIndexError(`index ${i} is past the end (${data.length})`);
  return v;
};

export { byteAt };
