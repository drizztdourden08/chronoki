/* @layer bridge-wasm @kind type */
type TechIdMaps = { newIdOf(id: number): number; oldIdOf(id: number): number; slotOf(character: number, slot: number): number };

export type { TechIdMaps };
