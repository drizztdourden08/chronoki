/* @layer bridge-wasm @kind constants */
import type { CtModeId } from '../world/modes/ct-mode-def.type';
import type { ModeHookFactory } from './mode-hook.type';

const MODE_HOOK_FACTORIES: Readonly<Partial<Record<CtModeId, ModeHookFactory>>> = {};

export { MODE_HOOK_FACTORIES };
