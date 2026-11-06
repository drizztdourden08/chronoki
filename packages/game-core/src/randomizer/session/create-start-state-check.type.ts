/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type StartStateCheck = {
  read(view: MemoryView): string;
  matches(view: MemoryView): boolean;
  settled(view: MemoryView): boolean;
  underway(view: MemoryView): boolean;
};

export type { StartStateCheck };
