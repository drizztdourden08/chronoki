/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES } from '../../checks/gift-ops.constants';
import { mapScriptCoord } from './map-script-coord';
import { pointerAt } from './script-ops';
import type { SpliceShift } from './script-splice.type';

const MAX_POINTER = 0xffff;

/** Rewrites the object/function pointer table of `next` in place; returns what could not be moved. */
const shiftScriptPointers = (old: Uint8Array, next: Uint8Array, shift: SpliceShift): string[] => {
  const failed: string[] = [];
  const header = (old[0] ?? 0) * OBJECT_HEADER_BYTES;
  for (let k = 0; k < (old[0] ?? 0) * OBJECT_FUNCTIONS; k += 1) {
    const p = pointerAt(old, k);
    if (p < header || p > old.length - 1) continue;
    const moved = mapScriptCoord(p, shift);
    if (moved === null || moved > MAX_POINTER) {
      failed.push(`pointer ${k} (${p}) cannot move`);
      continue;
    }
    next[1 + k * 2] = moved & 0xff;
    next[2 + k * 2] = moved >> 8;
  }
  return failed;
};

export { shiftScriptPointers };
