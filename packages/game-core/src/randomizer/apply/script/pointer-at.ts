/* @layer bridge-wasm @kind logic */
const pointerAt = (raw: Uint8Array, k: number): number => (raw[1 + k * 2] ?? 0) | ((raw[2 + k * 2] ?? 0) << 8);

export { pointerAt };
