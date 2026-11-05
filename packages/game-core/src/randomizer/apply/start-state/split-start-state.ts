/* @layer bridge-wasm @kind logic */
import type { CtFlagBit, CtStartState } from './ct-start-state.type';
import { LATE_FLAG_ADDRESSES } from './start-split.constants';

const splitStartState = (state: CtStartState): { early: CtFlagBit[]; late: CtStartState } => ({
  early: state.flags.filter((flag) => !LATE_FLAG_ADDRESSES.has(flag.at)),
  late: { ...state, flags: state.flags.filter((flag) => LATE_FLAG_ADDRESSES.has(flag.at)) },
});

export { splitStartState };
