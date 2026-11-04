/* @layer bridge-wasm @kind logic */
import { byteAt } from './read-bytes';
import { wordAt } from './read-word';

const triAt = (heap: Uint8Array, at: number): number => wordAt(heap, at) | (byteAt(heap, at + 2) << 16);

export { triAt };
