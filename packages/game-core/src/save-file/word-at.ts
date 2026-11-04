/* @layer bridge-wasm @kind logic */
const wordAt = (bytes: Uint8Array, offset: number): number => bytes[offset] | (bytes[offset + 1] << 8);

export { wordAt };
