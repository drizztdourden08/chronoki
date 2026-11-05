/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../../world/ct-world-input.type';
import type { CtFlagBit, CtStartState } from './ct-start-state.type';
import { EPOCH_FAIL_DROPPED_FLAG, EPOCH_FAIL_FLAGS, EPOCH_FAIL_POKES, EPOCH_FAIL_WARP } from './epoch-fail-start.constants';

const withoutDropped = (flags: readonly CtFlagBit[]): CtFlagBit[] =>
  flags
    .map((flag) => (flag.at === EPOCH_FAIL_DROPPED_FLAG.at ? { at: flag.at, bits: flag.bits & ~EPOCH_FAIL_DROPPED_FLAG.bits } : flag))
    .filter((flag) => flag.bits !== 0);

const withEpochFail = (state: CtStartState, options: CtOptionValues = {}): CtStartState => {
  if (options.epochFail !== true) return state;
  const replaced = new Set(EPOCH_FAIL_POKES.map((poke) => poke.at));
  return {
    ...state,
    flags: [...withoutDropped(state.flags), ...EPOCH_FAIL_FLAGS],
    pokes: [...state.pokes.filter((poke) => !replaced.has(poke.at)), ...EPOCH_FAIL_POKES],
    warp: { ...state.warp, ...EPOCH_FAIL_WARP },
  };
};

export { withEpochFail };
