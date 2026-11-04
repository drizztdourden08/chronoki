/* @layer shared-asset-extraction @kind logic */
import { RomIndexError } from './rom-index-error';

const itemAt = <T>(list: readonly T[], i: number): T => {
  const v = list[i];
  if (v === undefined) throw new RomIndexError(`list index ${i} is out of range (${list.length})`);
  return v;
};

export { itemAt };
