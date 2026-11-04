/* @layer shared-asset-extraction @kind logic */

const byName = (a: string, b: string): number => {
  if (a < b) return -1;
  return a > b ? 1 : 0;
};

export { byName };
