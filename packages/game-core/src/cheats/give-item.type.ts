/* @layer bridge-wasm @kind type */
import type { CheatWrite } from './cheat-write.type';

type GiveItemOptions = { heap: Uint8Array; ptr: number; write: CheatWrite; id: number; count: number };

export type { GiveItemOptions };
