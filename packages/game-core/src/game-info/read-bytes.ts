/* @layer bridge-wasm @kind logic */
const byteAt = (heap: Uint8Array, at: number): number => heap[at] ?? 0;
const wordAt = (heap: Uint8Array, at: number): number => byteAt(heap, at) | (byteAt(heap, at + 1) << 8);
const triAt = (heap: Uint8Array, at: number): number => wordAt(heap, at) | (byteAt(heap, at + 2) << 16);

export { byteAt, triAt, wordAt };
