/* @layer bridge-wasm @kind constants */
import type { CtModeId } from '../world/modes/ct-mode-def.type';
import { createGoalWatch } from './create-goal-watch';
import { ICE_AGE_GOAL, LEGACY_OF_CYRUS_GOAL } from './goal-flags.constants';
import type { ModeHookFactory } from './mode-hook.type';

const MODE_HOOK_FACTORIES: Readonly<Partial<Record<CtModeId, ModeHookFactory>>> = {
  'legacy-of-cyrus': () => createGoalWatch(LEGACY_OF_CYRUS_GOAL),
  'ice-age': () => createGoalWatch(ICE_AGE_GOAL),
};

export { MODE_HOOK_FACTORIES };
