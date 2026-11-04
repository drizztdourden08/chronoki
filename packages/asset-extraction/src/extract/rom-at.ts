/* @layer shared-asset-extraction @kind logic */

const at = (data: Uint8Array, i: number): number => {
  if (i < 0 || i >= data.length) throw new RangeError('index out of range');
  return data[i]!;
};

export { at };
