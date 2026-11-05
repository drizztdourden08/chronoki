/* @layer bridge-wasm @kind logic */
import { deriveChestChecks } from '../checks/derive-chest-checks';
import { deriveGiftChecks } from '../checks/derive-gift-checks';
import type { ApplyOptions, ApplyResult, PackEdit, Placement } from './apply-seed.type';
import { planSpotGiftSplices } from './plan-spot-gift-splices';
import type { ScriptSplice } from './script/script-splice.type';
import { spliceSceneScripts } from './script/splice-scene-scripts';
import type { SeedPlanContext } from './seed-plan-step.type';
import { SEED_PLAN_STEPS } from './seed-plan-steps.constants';

const stale = (pack: Uint8Array, edits: PackEdit[]): string[] =>
  edits.filter((e) => pack[e.at] !== e.old).map((e) => e.why);

const applySeedToPack = (
  pack: Uint8Array,
  placement: Placement,
  splices: readonly ScriptSplice[] = [],
  options: ApplyOptions = {},
): ApplyResult => {
  const chests = deriveChestChecks(pack);
  const gifts = deriveGiftChecks(pack);
  const known = new Set<string>([...chests, ...gifts].map((c) => c.id).concat(options.spotGifts ?? []));
  const unknown = Object.keys(placement).filter((id) => !known.has(id));
  const spotPlan = planSpotGiftSplices(placement, options.spotGifts);
  const base: SeedPlanContext = { chests, gifts, placement, spotPlan, seed: options.seed ?? '', done: {} };
  const plans = SEED_PLAN_STEPS.reduce<SeedPlanContext>(
    (ctx, step) => ({ ...ctx, done: { ...ctx.done, [step.key]: step.when(options) ? step.plan(pack, options, ctx) : { edits: [], failed: [] } } }),
    base,
  ).done;
  const planned = SEED_PLAN_STEPS.map((step) => plans[step.key] ?? { edits: [], failed: [] });
  const edits = planned.flatMap((plan) => plan.edits);
  const failed = [...new Set([...unknown, ...planned.flatMap((plan) => plan.failed), ...stale(pack, edits)])];
  if (failed.length > 0) return { ok: false, failed };
  const edited = pack.slice();
  edits.forEach((e) => {
    edited[e.at] = e.next;
  });
  const spliced = spliceSceneScripts(edited, [...splices, ...spotPlan.splices]);
  if (!spliced.ok) return { ok: false, failed: [...new Set(spliced.failed)] };
  return { ok: true, bytes: spliced.bytes, edits: edits.length };
};

export { applySeedToPack };
