/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../../world/ct-world-input.type';
import type { CtStartState } from './ct-start-state.type';
import { EARLY_PENDANT_FLAGS, UNLOCKED_MAGIC_FLAGS } from './option-start-flags.constants';

const withOptionFlags = (state: CtStartState, options: CtOptionValues = {}): CtStartState => {
  const extra = [
    ...(options.earlyPendantCharge === true ? EARLY_PENDANT_FLAGS : []),
    ...(options.unlockedMagic === true ? UNLOCKED_MAGIC_FLAGS : []),
  ];
  return extra.length === 0 ? state : { ...state, flags: [...state.flags, ...extra] };
};

export { withOptionFlags };
