/* @layer shared-asset-extraction @kind logic */

const cgramWords = (cg: Uint8Array): number[] =>
  Array.from({ length: 256 }, (_, i) => (cg[i * 2] as number) | ((cg[i * 2 + 1] as number) << 8));

export { cgramWords };
