/* @layer shared-asset-extraction @kind logic */

const u16 = (d: Uint8Array, o: number): number => d[o]! | (d[o + 1]! << 8);

export { u16 };
