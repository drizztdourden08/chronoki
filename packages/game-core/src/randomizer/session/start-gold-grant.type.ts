/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type WramWrite = (offset: number, bytes: Uint8Array) => boolean;

type StartGoldGrant = {
  observe(started: boolean, view: MemoryView): boolean;
  granted(): boolean;
  reset(): void;
};

export type { StartGoldGrant, WramWrite };
