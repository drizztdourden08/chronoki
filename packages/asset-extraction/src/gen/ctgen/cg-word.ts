/* @layer shared-asset-extraction @kind logic */
const cgWord = (cg: Uint8Array, i: number): number => (cg[i * 2] as number) | ((cg[i * 2 + 1] as number) << 8);

export { cgWord };
