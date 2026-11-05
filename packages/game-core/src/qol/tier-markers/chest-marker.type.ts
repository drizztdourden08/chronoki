/* @layer bridge-wasm @kind types */
type ChestTier = 0 | 1 | 2 | 3 | 4;
type ChestMarker = { x: number; y: number; tier: ChestTier; opened: { offset: number; mask: number } };
type ChestMarkers = ReadonlyMap<number, readonly ChestMarker[]>;

export type { ChestMarker, ChestMarkers, ChestTier };
