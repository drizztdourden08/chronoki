/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

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

type GameStartWatch = {
  observe(view: MemoryView): boolean;
  started(): boolean;
  reset(): void;
};

export type { GameStartWatch, GiftTarget, GiftWatch, SaveLoadWatch };
