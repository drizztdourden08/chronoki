/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec } from './ct-region-spec.type';
import { mapRegionIndexOf } from './map-region-index-of';

const droppedMapsOf = (all: readonly CtRegionSpec[], kept: readonly CtRegionSpec[]): ReadonlySet<number> => {
  const keptMaps = mapRegionIndexOf(kept);
  return new Set([...mapRegionIndexOf(all).keys()].filter((map) => !keptMaps.has(map)));
};

export { droppedMapsOf };
