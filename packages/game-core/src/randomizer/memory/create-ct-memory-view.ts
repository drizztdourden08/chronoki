/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';
import { CT_WRAM_BYTES, CT_WRAM_REGION } from './ct-memory.constants';

const createCtMemoryView = (heap: Uint8Array, ptr: number): MemoryView => {
  const byte = (region: string, offset: number): number =>
    region === CT_WRAM_REGION && offset >= 0 && offset < CT_WRAM_BYTES ? (heap[ptr + offset] ?? 0) : 0;
  const word = (region: string, offset: number): number => byte(region, offset) | (byte(region, offset + 1) << 8);
  return { byte, word };
};

export { createCtMemoryView };
