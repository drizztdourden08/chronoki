/* @layer bridge-wasm @kind logic */
import type { PlacementSummary } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from './ct-placement.type';
import { bossRowsOf } from './boss-rows-of';
import { elementRowsOf } from './element-rows-of';
import { characterRowsOf } from './recruits/character-rows-of';
import { mysteryRowsOf } from './mystery/mystery-rows-of';
import { keyItemsInChestsOf } from './key-items-in-chests-of';
import { isCtKeyItem } from './is-ct-key-item';
import { startPartyLabelOf } from './party/start-party-label-of';

const describeCtPlacement = (placement: CtPlacement): PlacementSummary => {
  const keyItems = placement.locations.filter(([, item]) => isCtKeyItem(item)).length;
  const inChests = keyItemsInChestsOf(placement);
  return {
    seed: placement.seed,
    rows: [
      { label: 'Locations', value: String(placement.locations.length) },
      { label: 'Treasure', value: String(placement.locations.length - keyItems) },
      { label: 'Key items', value: String(keyItems) },
      ...(inChests === 0 ? [] : [{ label: 'Key items in chests', value: String(inChests) }]),
      { label: 'Spheres', value: String(placement.spheres.length) },
      ...(placement.startParty === undefined
        ? []
        : [{ label: 'Starting party', value: startPartyLabelOf(placement.startParty) }]),
      ...bossRowsOf(placement.bosses),
      ...characterRowsOf(placement.characters),
      ...elementRowsOf(placement.elements),
      ...mysteryRowsOf(placement.mystery),
    ],
  };
};

export { describeCtPlacement };
