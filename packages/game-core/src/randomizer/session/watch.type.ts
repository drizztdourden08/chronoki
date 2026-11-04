/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';

type GiftTarget = { id: string; locationId: number; item: number };

type GiftWatch = {
  observe(view: MemoryView): void;
  reset(): void;
  completed(): ReadonlySet<string>;
};

type SaveLoadWatch = {
  loaded(view: MemoryView): boolean;
  reset(): void;
};

export type { GiftTarget, GiftWatch, SaveLoadWatch };
