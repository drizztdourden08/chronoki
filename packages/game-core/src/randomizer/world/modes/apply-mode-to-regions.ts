/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec, CtRule } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import { exitNameOf } from '../exit-name-of';
import type { CtModeDef } from './ct-mode-def.type';

const withRule = <Base extends object>(base: Base, rule: CtRule | undefined): Base & { rule?: CtRule } =>
  (rule === undefined ? base : { ...base, rule });

const isRemovedExit = (mode: CtModeDef, from: CtRegionId, to: CtRegionId): boolean =>
  (mode.removedExits ?? []).some((removed) => removed.from === from && removed.to === to);

const exitsOf = (spec: CtRegionSpec, mode: CtModeDef, keptIds: ReadonlySet<CtRegionId>): CtRegionSpec['exits'] => {
  const patches = mode.rulePatches.exits ?? {};
  return [
    ...spec.exits
      .filter((exit) => keptIds.has(exit.to) && !isRemovedExit(mode, spec.id, exit.to))
      .map((exit) => withRule({ to: exit.to }, patches[exitNameOf(spec.id, exit.to)] ?? exit.rule)),
    ...mode.extraExits
      .filter((extra) => extra.from === spec.id && keptIds.has(extra.to))
      .map((extra) => withRule({ to: extra.to }, extra.rule)),
  ];
};

const spotsOf = (spec: CtRegionSpec, mode: CtModeDef): CtRegionSpec['spots'] => {
  const patches = mode.rulePatches.spots ?? {};
  const removed = new Set(mode.removedSpots ?? []);
  return spec.spots
    .filter((spot) => !removed.has(spot.id))
    .map((spot) => withRule({ id: spot.id, name: spot.name }, patches[spot.id] ?? spot.rule));
};

const eventsOf = (spec: CtRegionSpec, mode: CtModeDef): CtRegionSpec['events'] => {
  const patches = mode.rulePatches.events ?? {};
  return [
    ...spec.events.map((event) => withRule({ id: event.id }, patches[event.id] ?? event.rule)),
    ...(mode.extraEvents ?? [])
      .filter((extra) => extra.region === spec.id)
      .map((extra) => withRule({ id: extra.id }, patches[extra.id] ?? extra.rule)),
  ];
};

const applyModeToRegions = (specs: readonly CtRegionSpec[], mode: CtModeDef): CtRegionSpec[] => {
  const removed = new Set(mode.removedRegions ?? []);
  const kept = specs.filter((spec) => mode.eras.includes(spec.era) && !removed.has(spec.id));
  const keptIds = new Set<CtRegionId>(kept.map((spec) => spec.id));
  return kept.map((spec): CtRegionSpec => ({
    ...spec,
    exits: exitsOf(spec, mode, keptIds),
    spots: spotsOf(spec, mode),
    events: eventsOf(spec, mode),
  }));
};

export { applyModeToRegions };
