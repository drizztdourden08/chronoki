/* @layer shared-asset-extraction @kind logic */
class RomIndexError extends Error {}

const byteAt = (data: ArrayLike<number>, i: number): number => {
  const v = data[i];
  if (v === undefined) throw new RomIndexError(`index ${i} is past the end (${data.length})`);
  return v;
};

const wordAt = (data: ArrayLike<number>, i: number): number => byteAt(data, i) | (byteAt(data, i + 1) << 8);

const itemAt = <T>(list: readonly T[], i: number): T => {
  const v = list[i];
  if (v === undefined) throw new RomIndexError(`list index ${i} is out of range (${list.length})`);
  return v;
};

export { byteAt, itemAt, RomIndexError, wordAt };
