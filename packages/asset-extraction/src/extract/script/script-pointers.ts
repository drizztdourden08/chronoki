/* @layer shared-asset-extraction @kind logic */
import { getEntries3Byte } from '../rom-read';
import { SCRIPT_PTRS } from './script-load.constants';

const pointerCache = new WeakMap<Uint8Array, number[]>();

const scriptPointers = (rom: Uint8Array): number[] => {
  const hit = pointerCache.get(rom);
  if (hit) return hit;
  const ptrs = getEntries3Byte(rom, SCRIPT_PTRS, 513);
  pointerCache.set(rom, ptrs);
  return ptrs;
};

export { scriptPointers };
