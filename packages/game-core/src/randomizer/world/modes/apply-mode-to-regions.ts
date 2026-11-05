/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec, CtRule } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import { exitNameOf } from '../exit-name-of';
import type { CtModeDef } from './ct-mode-def.type';

const withRule = <Base extends object>(base: Base, rule: CtRule | undefined): Base & { rule?: CtRule } =>
  (rule === undefined ? base : { ...base, rule });

const applyModeToRegions = (specs: readonly CtRegionSpec[], mode: CtModeDef): CtRegionSpec[] => {
  const kept = specs.filter((spec) => mode.eras.includes(spec.era));
  const keptIds = new Set<CtRegionId>(kept.map((spec) => spec.id));
  const { exits: exitPatches = {}, spots: spotPatches = {}, events: eventPatches = {} } = mode.rulePatches;
  return kept.map((spec): CtRegionSpec => ({
    ...spec,
    exits: [
      ...spec.exits
        .filter((exit) => keptIds.has(exit.to))
        .map((exit) => withRule({ to: exit.to }, exitPatches[exitNameOf(spec.id, exit.to)] ?? exit.rule)),
      ...mode.extraExits
        .filter((extra) => extra.from === spec.id && keptIds.has(extra.to))
        .map((extra) => withRule({ to: extra.to }, extra.rule)),
    ],
    spots: spec.spots.map((spot) => withRule({ id: spot.id, name: spot.name }, spotPatches[spot.id] ?? spot.rule)),
    events: spec.events.map((event) => withRule({ id: event.id }, eventPatches[event.id] ?? event.rule)),
  }));
};

export { applyModeToRegions };
