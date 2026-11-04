/* @layer shared-asset-extraction @kind logic */

const signed = (r: number): number => (r >= 0x80 ? r - 256 : r);

export { signed };
