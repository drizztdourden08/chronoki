/* @layer bridge-wasm @kind constants */
import type { ModeHook } from './mode-hook.type';

const IDLE_HOOK: ModeHook = { observe: () => undefined, goalReached: () => false, reset: () => undefined };

export { IDLE_HOOK };
