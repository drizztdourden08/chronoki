/* @layer bridge-wasm @kind test */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

const fakeView = (bytes: Record<number, number>): MemoryView => {
  const byte = (_region: string, offset: number): number => bytes[offset] ?? 0;
  const word = (region: string, offset: number): number => byte(region, offset) | (byte(region, offset + 1) << 8);
  return { byte, word };
};

export { fakeView };
