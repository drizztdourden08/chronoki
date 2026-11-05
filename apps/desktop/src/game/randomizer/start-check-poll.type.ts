/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type StartCheckPoll = {
  poll(view: MemoryView, newGame: boolean): void;
  reset(): void;
};

export type { StartCheckPoll };
