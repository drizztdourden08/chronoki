/* @layer bridge-wasm @kind logic */
import { rollCtPlacement } from '../world/roll-ct-placement';
import type { GoldenCase, GoldenPlacement } from './golden-seeds.type';

const goldenPlacementOf = ({ seed, options }: GoldenCase): GoldenPlacement => {
  const placement = rollCtPlacement({ options }, seed);
  const spots = placement.locations
    .map(([spot, item]) => [String(spot), String(item)] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return { seed, options, startParty: (placement.startParty ?? []).map(String), spots: Object.fromEntries(spots) };
};

export { goldenPlacementOf };
