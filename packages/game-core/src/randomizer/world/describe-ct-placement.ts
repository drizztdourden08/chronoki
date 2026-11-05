/* @layer bridge-wasm @kind logic */
import type { PlacementSummary } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from './ct-placement.type';
import { bossRowsOf } from './boss-rows-of';
import { isCtKeyItem } from './is-ct-key-item';
import { startPartyLabelOf } from './party/start-party-label-of';

const describeCtPlacement = (placement: CtPlacement): PlacementSummary => {
  const keyItems = placement.locations.filter(([, item]) => isCtKeyItem(item)).length;
  return {
    seed: placement.seed,
    rows: [
      { label: 'Locations', value: String(placement.locations.length) },
      { label: 'Treasure', value: String(placement.locations.length - keyItems) },
      { label: 'Key items', value: String(keyItems) },
      { label: 'Spheres', value: String(placement.spheres.length) },
      ...(placement.startParty === undefined
        ? []
        : [{ label: 'Starting party', value: startPartyLabelOf(placement.startParty) }]),
      ...bossRowsOf(placement.bosses),
    ],
  };
};

export { describeCtPlacement };
