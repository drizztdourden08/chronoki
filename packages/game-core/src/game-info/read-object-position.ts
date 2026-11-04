/* @layer bridge-wasm @kind logic */
import { OBJECT_STRIDE, OBJECT_SUBPIXEL_SHIFT, OBJECT_UNUSED_WORD } from './wram-map.constants';
import { wordAt } from './read-word';

const objectPixel = (heap: Uint8Array, ptr: number, tableBase: number, index: number): number | null => {
  const raw = wordAt(heap, ptr + tableBase + index * OBJECT_STRIDE);
  return raw === OBJECT_UNUSED_WORD ? null : raw >> OBJECT_SUBPIXEL_SHIFT;
};

export { objectPixel };
