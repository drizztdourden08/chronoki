/* @layer shared-asset-extraction @kind logic */
const tileWord = (b: Uint8Array, r: number, c: number): number =>
  (b[r * 0x40 + c * 2] as number) | ((b[r * 0x40 + c * 2 + 1] as number) << 8);

export { tileWord };
