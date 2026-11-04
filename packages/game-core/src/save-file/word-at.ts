/* @layer bridge-wasm @kind logic */
const wordAt = (bytes: Uint8Array, offset: number): number => (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);

export { wordAt };
