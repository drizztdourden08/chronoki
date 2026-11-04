/* @layer bridge-wasm @kind constants */
import type { CtEventId } from './ct-world-keys.type';
import { exitNameOf } from './exit-name-of';
import { CT_REGIONS } from './regions/ct-regions.constants';
import { ruleMapOf } from './rule-map-of';

const CT_EXIT_RULES = ruleMapOf<string>(CT_REGIONS.flatMap((spec) =>
  spec.exits.map((exit) => [exitNameOf(spec.id, exit.to), exit.rule] as const)));

const CT_SPOT_RULES = ruleMapOf<string>(CT_REGIONS.flatMap((spec) =>
  spec.spots.map((spot) => [spot.id, spot.rule] as const)));

const CT_EVENT_RULES = ruleMapOf<CtEventId>(CT_REGIONS.flatMap((spec) =>
  spec.events.map((event) => [event.id, event.rule] as const)));

export { CT_EVENT_RULES, CT_EXIT_RULES, CT_SPOT_RULES };
