/* @layer bridge-wasm @kind logic */
const byteAt = (heap: Uint8Array, at: number): number => heap[at] ?? 0;

export { byteAt };
