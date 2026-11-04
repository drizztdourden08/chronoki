/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec } from './ct-region-spec.type';
import type { CtRegionId } from './ct-world-keys.type';

const mapRegionIndexOf = (specs: readonly CtRegionSpec[]): ReadonlyMap<number, CtRegionId> =>
  new Map(specs.flatMap((spec) => spec.maps.map((map): [number, CtRegionId] => [map, spec.id])));

export { mapRegionIndexOf };
