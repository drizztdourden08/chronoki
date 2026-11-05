/* @layer bridge-wasm @kind logic */
import { ctOptionValues } from '../world/ct-option-values';
import { LEGACY_PARTY } from '../world/recruits/legacy-party.constants';
import { rollCtPlacement } from '../world/roll-ct-placement';
import { compareCodes } from './compare-codes';
import { verifyInputOf } from './verify-synthetic-input';
import type { GoldenCase, GoldenPlacement } from './golden-seeds.type';

const goldenPlacementOf = ({ seed, options }: GoldenCase): GoldenPlacement => {
  const placement = rollCtPlacement(verifyInputOf(ctOptionValues(options), LEGACY_PARTY), seed);
  const spots = placement.locations
    .map(([spot, item]) => [String(spot), String(item)] as const)
    .sort(([a], [b]) => compareCodes(a, b));
  return { seed, options, startParty: (placement.startParty ?? []).map(String), spots: Object.fromEntries(spots) };
};

export { goldenPlacementOf };
