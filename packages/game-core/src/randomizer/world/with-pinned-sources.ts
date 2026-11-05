/* @layer bridge-wasm @kind logic */
import type { Region, WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import { CT_LOCATION_KIND_TREASURE } from './ct-world.constants';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { PinnedSource } from './pinned-source.type';

const sourceLocationOf = (source: PinnedSource): WorldLocation<CtWorldKeys> => ({
  key: source.key,
  region: source.region,
  vanillaItem: source.item,
  tags: { kind: CT_LOCATION_KIND_TREASURE, name: source.name, checkId: source.key, checkKind: 'gift', mapId: source.mapId },
});

const withPinnedSources = (
  regions: readonly Region<CtWorldKeys>[], sources: readonly PinnedSource[],
): Region<CtWorldKeys>[] =>
  regions.map((region) => {
    const added = sources.filter((source) => source.region === region.id).map(sourceLocationOf);
    return added.length === 0 ? region : { ...region, locations: [...region.locations, ...added] };
  });

export { withPinnedSources };
