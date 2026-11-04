/* @layer shared-asset-extraction @kind logic */

const u16 = (d: Uint8Array, o: number): number => (d[o] as number) | ((d[o + 1] as number) << 8);

export { u16 };
