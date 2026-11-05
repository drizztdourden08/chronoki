/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../world/ct-world-input.type';
import { bucketCountsOf } from '../world/bucket/bucket-counts-of';
import { objectivesOf } from '../world/bucket/objectives-of';
import { createObjectiveWatch } from './create-objective-watch';
import { tabAmountsOf } from '../world/tabs/tab-amounts-of';
import { effectiveOptionsOf } from '../world/modes/effective-options-of';
import { modeOf } from '../world/modes/mode-of';
import { IDLE_HOOK } from './create-mode-hooks.constants';
import { createJetsWingsWatch } from './create-jets-wings-watch';
import { createTabAmountWatch } from './create-tab-amount-watch';
import type { ModeHook } from './mode-hook.type';
import type { ModeRunContext } from './mode-run-context.type';
import { MODE_HOOK_FACTORIES } from './mode-hooks.constants';
import type { WramWrite } from './start-gold-grant.type';

const combine = (hooks: readonly ModeHook[]): ModeHook => ({
  observe: (view, started, newGame) => hooks.forEach((hook) => hook.observe(view, started, newGame)),
  goalReached: () => hooks.some((hook) => hook.goalReached()),
  reset: () => hooks.forEach((hook) => hook.reset()),
});

const objectiveHookOf = (effective: CtOptionValues, write: WramWrite, { seed, party, log }: ModeRunContext): ModeHook[] => {
  if (seed === undefined || party === undefined) return [];
  const objectives = objectivesOf(effective, seed, party);
  if (objectives.length === 0) return [];
  const needed = bucketCountsOf(effective, objectives.length).needed;
  return [createObjectiveWatch(write, objectives.map((objective) => objective.source), needed, log)];
};

const createModeHooks = (options: CtOptionValues, write: WramWrite, run: ModeRunContext = {}): ModeHook => {
  const { seed } = run;
  const effective = effectiveOptionsOf(options);
  const tabs = seed === undefined ? null : tabAmountsOf(effective, seed);
  const factory = MODE_HOOK_FACTORIES[modeOf(effective).id];
  const hooks = [
    factory === undefined ? IDLE_HOOK : factory(effective, write),
    ...(effective.epochFail === true ? [createJetsWingsWatch(write)] : []),
    ...(tabs === null ? [] : [createTabAmountWatch(write, tabs)]),
    ...objectiveHookOf(effective, write, run),
  ];
  return hooks.length === 1 ? (hooks[0] ?? IDLE_HOOK) : combine(hooks);
};

export { createModeHooks };
