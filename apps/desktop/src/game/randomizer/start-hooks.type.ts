/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type StartHooks = {
  observe(view: MemoryView, started: boolean, newGame: boolean): void;
  reset(): void;
};

export type { StartHooks };
