/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec } from '../ct-region-spec.type';
import { FLIGHT_EXITS, FLIGHT_SPOTS } from './epoch-fail-flight.constants';
import { withJetsRule } from './with-jets-rule';

const isFlightExit = (spec: CtRegionSpec, to: string): boolean =>
  FLIGHT_EXITS.some((flight) => flight.from === spec.id && flight.to === to);

const applyEpochFailToRegions = (specs: readonly CtRegionSpec[]): CtRegionSpec[] =>
  specs.map((spec): CtRegionSpec => ({
    ...spec,
    exits: spec.exits.map((exit) => (isFlightExit(spec, exit.to) ? { to: exit.to, rule: withJetsRule(exit.rule) } : exit)),
    spots: spec.spots.map((spot) =>
      (FLIGHT_SPOTS.includes(spot.id) ? { id: spot.id, name: spot.name, rule: withJetsRule(spot.rule) } : spot)),
  }));

export { applyEpochFailToRegions };
