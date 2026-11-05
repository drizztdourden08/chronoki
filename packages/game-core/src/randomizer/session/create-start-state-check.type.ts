/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type StartStateCheck = { read(view: MemoryView): string; settled(view: MemoryView): boolean };

export type { StartStateCheck };
