/* @layer bridge-wasm @kind logic */
import type { CkStamp, Loadability } from './sectioned-state.type';
import { MESSAGE_NOT_A_STATE, MESSAGE_WORLD_MODE, PIN_SHORT } from './check-loadable.constants';
import { decodeSectionedState } from './decode-sectioned-state';

const madeBy = (stamp: CkStamp): string =>
  `ChronoKi core ${stamp.core || 'unknown'} (Belthasar ${stamp.pin.slice(0, PIN_SHORT) || 'unknown'})`;

const checkLoadable = (bytes: Uint8Array, current: CkStamp | null): Loadability => {
  const state = decodeSectionedState(bytes);
  if (!state) return { ok: false, stamp: null, reason: 'not-a-state', message: MESSAGE_NOT_A_STATE };
  const { stamp } = state;
  if (!stamp.legacy && current && stamp.schema !== current.schema) {
    return {
      ok: false,
      stamp,
      reason: 'format-mismatch',
      message: `This save state was made by ${madeBy(stamp)}, which used a different save state format.`,
    };
  }
  if (stamp.mode === 'world') return { ok: false, stamp, reason: 'unsupported-mode', message: MESSAGE_WORLD_MODE };
  return { ok: true, stamp };
};

export { checkLoadable };
