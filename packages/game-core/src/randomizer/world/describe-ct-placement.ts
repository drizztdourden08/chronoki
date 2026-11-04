/* @layer bridge-wasm @kind logic */
import type { PlacementSummary } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from './ct-placement.type';
import { isCtKeyItem } from './is-ct-key-item';

const describeCtPlacement = (placement: CtPlacement): PlacementSummary => {
  const keyItems = placement.locations.filter(([, item]) => isCtKeyItem(item)).length;
  return {
    seed: placement.seed,
    rows: [
      { label: 'Locations', value: String(placement.locations.length) },
      { label: 'Treasure', value: String(placement.locations.length - keyItems) },
      { label: 'Key items', value: String(keyItems) },
      { label: 'Spheres', value: String(placement.spheres.length) },
    ],
  };
};

export { describeCtPlacement };
