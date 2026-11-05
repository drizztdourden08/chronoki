/* @layer bridge-wasm @kind logic */
const readPackU16 = (pack: Uint8Array, at: number): number => (pack[at] ?? 0) | ((pack[at + 1] ?? 0) << 8);

export { readPackU16 };
