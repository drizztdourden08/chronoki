/* @layer bridge-wasm @kind test */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';

const fakeView = (bytes: Record<number, number>): MemoryView => {
  const byte = (_region: string, offset: number): number => bytes[offset] ?? 0;
  return { byte, word: (region: string, offset: number) => byte(region, offset) | (byte(region, offset + 1) << 8) } as unknown as MemoryView;
};

export { fakeView };
