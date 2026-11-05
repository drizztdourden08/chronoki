/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../world/ct-world-input.type';
import { effectiveOptionsOf } from '../world/modes/effective-options-of';
import { modeOf } from '../world/modes/mode-of';
import type { ModeHook } from './mode-hook.type';
import { MODE_HOOK_FACTORIES } from './mode-hooks.constants';
import type { WramWrite } from './start-gold-grant.type';

const IDLE_HOOK: ModeHook = { observe: () => undefined, goalReached: () => false, reset: () => undefined };

const createModeHooks = (options: CtOptionValues, write: WramWrite): ModeHook => {
  const effective = effectiveOptionsOf(options);
  const factory = MODE_HOOK_FACTORIES[modeOf(effective).id];
  return factory === undefined ? IDLE_HOOK : factory(effective, write);
};

export { createModeHooks };
