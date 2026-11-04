/* @layer shared-asset-extraction @kind logic */

const byName = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

export { byName };
