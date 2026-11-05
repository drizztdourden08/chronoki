/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec } from './ct-region-spec.type';
import type { CtRuleMaps } from './ct-rule-maps.type';
import type { CtEventId } from './ct-world-keys.type';
import { exitNameOf } from './exit-name-of';
import { ruleMapOf } from './rule-map-of';

const ruleMapsOfRegions = (specs: readonly CtRegionSpec[]): CtRuleMaps => ({
  exitRules: ruleMapOf<string>(specs.flatMap((spec) =>
    spec.exits.map((exit) => [exitNameOf(spec.id, exit.to), exit.rule] as const))),
  spotRules: ruleMapOf<string>(specs.flatMap((spec) => spec.spots.map((spot) => [spot.id, spot.rule] as const))),
  eventRules: ruleMapOf<CtEventId>(specs.flatMap((spec) =>
    spec.events.map((event) => [event.id, event.rule] as const))),
});

export { ruleMapsOfRegions };
