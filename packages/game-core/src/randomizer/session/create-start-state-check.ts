/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { LOCATION_ID, LOCATION_MASK } from '../../game-info/wram-map.constants';
import type { CtFlagBit, CtStartState } from '../apply/start-state/ct-start-state.type';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { WRAM_CPU_BASE } from './session.constants';

type StartStateCheck = { read(view: MemoryView): string };

const hex = (value: number): string => `0x${value.toString(16)}`;

const mismatchesOf = (view: MemoryView, state: CtStartState): string[] => {
  const byteAt = (at: number): number => view.byte(CT_WRAM_REGION, at - WRAM_CPU_BASE);
  const unset = (flag: CtFlagBit): boolean => (byteAt(flag.at) & flag.bits) !== flag.bits;
  const stuck = (flag: CtFlagBit): boolean => (byteAt(flag.at) & flag.bits) !== 0;
  const location = view.word(CT_WRAM_REGION, LOCATION_ID) & LOCATION_MASK;
  return [
    ...state.flags.filter(unset).map((flag) => `flag ${hex(flag.at)}&${hex(flag.bits)} unset`),
    ...(state.clear ?? []).filter(stuck).map((flag) => `flag ${hex(flag.at)}&${hex(flag.bits)} still set`),
    ...(location === state.warp.location ? [] : [`location ${hex(location)} expected ${hex(state.warp.location)}`]),
  ];
};

const createStartStateCheck = (state: CtStartState): StartStateCheck => ({
  read: (view) => {
    const bad = mismatchesOf(view, state);
    return bad.length === 0
      ? `[Start] Start state ${state.id} read back ok (${state.flags.length} flags, location ${hex(state.warp.location)})`
      : `[Start] Start state ${state.id} MISMATCH: ${bad.join('; ')}`;
  },
});

export { createStartStateCheck };
