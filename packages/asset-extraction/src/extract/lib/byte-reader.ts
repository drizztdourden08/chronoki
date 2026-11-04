/* @layer shared-asset-extraction @kind logic */
/** Python's IndexError on a bytes/list read past the end: the packers' `try / except Exception` catches it. */
class RomIndexError extends Error {}

/** data[i]: Python raises IndexError past the end, a typed array answers undefined. */
const byteAt = (data: ArrayLike<number>, i: number): number => {
  const v = data[i];
  if (v === undefined) throw new RomIndexError(`index ${i} is past the end (${data.length})`);
  return v;
};

/** data[i] | data[i + 1] << 8 (sprites.u16). */
const wordAt = (data: ArrayLike<number>, i: number): number => byteAt(data, i) | (byteAt(data, i + 1) << 8);

/** list[i] for a list (an out-of-range index is an IndexError). */
const itemAt = <T>(list: readonly T[], i: number): T => {
  const v = list[i];
  if (v === undefined) throw new RomIndexError(`list index ${i} is out of range (${list.length})`);
  return v;
};

export { byteAt, itemAt, RomIndexError, wordAt };
