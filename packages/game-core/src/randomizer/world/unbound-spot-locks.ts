/* @layer bridge-wasm @kind logic */
import type { Region } from '@drizztdourden08/brock-randomizer/world';
import { CT_LOCATION_KIND_SPOT } from './ct-world.constants';
import type { CtItem, CtWorldKeys } from './ct-world-keys.type';

type UnboundSpotLock = readonly [location: string, item: CtItem];

const unboundSpotLocksOf = (regions: readonly Region<CtWorldKeys>[]): UnboundSpotLock[] =>
  regions.flatMap((region) => region.locations.flatMap((location): UnboundSpotLock[] =>
    (location.tags?.kind === CT_LOCATION_KIND_SPOT && location.tags.checkId === undefined && location.vanillaItem !== undefined
      ? [[location.key, location.vanillaItem]]
      : [])));

export type { UnboundSpotLock };
export { unboundSpotLocksOf };
