/* @layer bridge-wasm @kind logic */
import { byteAt } from './read-bytes';

const wordAt = (heap: Uint8Array, at: number): number => byteAt(heap, at) | (byteAt(heap, at + 1) << 8);

export { wordAt };
