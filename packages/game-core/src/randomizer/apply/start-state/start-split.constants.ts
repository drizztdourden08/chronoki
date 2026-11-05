/* @layer bridge-wasm @kind constants */
const EARLY_ANCHOR: readonly number[] = [0x10, 0x1a];

const EARLY_MAX_BYTES = 252;

const LATE_FLAG_ADDRESSES: ReadonlySet<number> = new Set([
  0x7f0057, 0x7f0060, 0x7f0062, 0x7f01ed, 0x7f01cd, 0x7f01df,
]);

export { EARLY_ANCHOR, EARLY_MAX_BYTES, LATE_FLAG_ADDRESSES };
