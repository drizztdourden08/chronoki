/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type StartMagicGrant = {
  observe(started: boolean, view: MemoryView): boolean;
  granted(): boolean;
  reset(): void;
};

export type { StartMagicGrant };
