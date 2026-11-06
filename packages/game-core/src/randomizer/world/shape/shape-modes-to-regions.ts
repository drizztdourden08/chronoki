/* @layer bridge-wasm @kind logic */
import type { CtEventSpec, CtExitSpec, CtRegionSpec, CtRule } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import { exitNameOf } from '../exit-name-of';
import type { CtModeDef } from '../modes/ct-mode-def.type';
import { applyModeToRegions } from '../modes/apply-mode-to-regions';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { gatedRuleOf } from './gated-rule-of';
import type { ModeView } from './per-mode-rules-of';
import { perModeRulesOf } from './per-mode-rules-of';

const withRule = <Base extends object>(base: Base, rule: CtRule | undefined): Base & { rule?: CtRule } =>
  (rule === undefined ? base : { ...base, rule });

const exitsOf = (base: CtRegionSpec, views: readonly ModeView[]): CtExitSpec[] =>
  [...perModeRulesOf(
    views, base.id,
    (spec) => spec.exits.map((exit) => [exit.to, exit.rule] as const),
    (to) => `Exit ${exitNameOf(base.id, to)}`,
  )].map(([to, perMode]) => withRule({ to }, gatedRuleOf(perMode)));

const eventsOf = (base: CtRegionSpec, views: readonly ModeView[]): CtEventSpec[] =>
  [...perModeRulesOf(
    views, base.id,
    (spec) => spec.events.map((event) => [event.id, event.rule] as const),
    (id) => `Event ${id}`,
  )].map(([id, perMode]) => withRule({ id }, gatedRuleOf(perMode)));

const shapeModesToRegions = (modes: readonly CtModeDef[]): CtRegionSpec[] => {
  const views = modes.map((mode): ModeView => ({
    id: mode.id,
    specs: new Map<CtRegionId, CtRegionSpec>(applyModeToRegions(CT_REGIONS, mode).map((spec) => [spec.id, spec])),
  }));
  return CT_REGIONS.map((base): CtRegionSpec => ({
    ...base,
    exits: exitsOf(base, views),
    events: eventsOf(base, views),
  }));
};

export { shapeModesToRegions };
