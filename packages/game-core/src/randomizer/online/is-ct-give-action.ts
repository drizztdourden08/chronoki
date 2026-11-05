/* @layer bridge-wasm @kind logic */
import type { CtGiveAction } from './give-ct-item.type';
import { GIVE_TYPES } from './is-ct-give-action.constants';

const isCtGiveAction = (action: unknown): action is CtGiveAction =>
  typeof action === 'object' && action !== null && 'kind' in action && action.kind === 'give'
  && 'item' in action && typeof action.item === 'object' && action.item !== null
  && 'type' in action.item && GIVE_TYPES.has(action.item.type);

export { isCtGiveAction };
