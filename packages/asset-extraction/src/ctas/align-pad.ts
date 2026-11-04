/* @layer shared-asset-extraction @kind logic */

const alignPad = (at: number): number => (8 - (at % 8)) % 8;

export { alignPad };
