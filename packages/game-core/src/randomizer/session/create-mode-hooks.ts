/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../world/ct-world-input.type';
import { effectiveOptionsOf } from '../world/modes/effective-options-of';
import { modeOf } from '../world/modes/mode-of';
import { IDLE_HOOK } from './create-mode-hooks.constants';
import { createJetsWingsWatch } from './create-jets-wings-watch';
import type { ModeHook } from './mode-hook.type';
import { MODE_HOOK_FACTORIES } from './mode-hooks.constants';
import type { WramWrite } from './start-gold-grant.type';

const combine = (hooks: readonly ModeHook[]): ModeHook => ({
  observe: (view, started, newGame) => hooks.forEach((hook) => hook.observe(view, started, newGame)),
  goalReached: () => hooks.some((hook) => hook.goalReached()),
  reset: () => hooks.forEach((hook) => hook.reset()),
});

const createModeHooks = (options: CtOptionValues, write: WramWrite): ModeHook => {
  const effective = effectiveOptionsOf(options);
  const factory = MODE_HOOK_FACTORIES[modeOf(effective).id];
  const hooks = [
    factory === undefined ? IDLE_HOOK : factory(effective, write),
    ...(effective.epochFail === true ? [createJetsWingsWatch(write)] : []),
  ];
  return hooks.length === 1 ? (hooks[0] ?? IDLE_HOOK) : combine(hooks);
};

export { createModeHooks };
