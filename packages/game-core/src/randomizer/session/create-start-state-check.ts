/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { CtStartParty } from '../world/party/ct-party.type';
import { partyIdsOf } from '../world/party/party-ids-of';
import { LOCATION_ID, LOCATION_MASK } from '../../game-info/wram-map.constants';
import type { CtFlagBit, CtPoke, CtStartState } from '../apply/start-state/ct-start-state.type';
import { LEGACY_PARTY } from '../apply/start-state/legacy-party.constants';
import { partyPokes } from '../apply/start-state/party-pokes';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { WRAM_CPU_BASE } from './session.constants';
import type { StartStateCheck } from './create-start-state-check.type';

const locationOf = (view: MemoryView): number => view.word(CT_WRAM_REGION, LOCATION_ID) & LOCATION_MASK;

const hex = (value: number): string => `0x${value.toString(16)}`;

const mismatchesOf = (view: MemoryView, state: CtStartState, party: CtStartParty): string[] => {
  const byteAt = (at: number): number => view.byte(CT_WRAM_REGION, at - WRAM_CPU_BASE);
  const unset = (flag: CtFlagBit): boolean => (byteAt(flag.at) & flag.bits) !== flag.bits;
  const stuck = (flag: CtFlagBit): boolean => (byteAt(flag.at) & flag.bits) !== 0;
  const location = locationOf(view);
  const wrongPoke = (poke: CtPoke): boolean => byteAt(poke.at) !== poke.value;
  return [
    ...state.flags.filter(unset).map((flag) => `flag ${hex(flag.at)}&${hex(flag.bits)} unset`),
    ...(state.clear ?? []).filter(stuck).map((flag) => `flag ${hex(flag.at)}&${hex(flag.bits)} still set`),
    ...partyPokes(partyIdsOf(party)).filter(wrongPoke).map((poke) => `party ${hex(poke.at)}=${hex(byteAt(poke.at))} expected ${hex(poke.value)}`),
    ...(location === state.warp.location ? [] : [`location ${hex(location)} expected ${hex(state.warp.location)}`]),
  ];
};

const createStartStateCheck = (state: CtStartState, party: CtStartParty = LEGACY_PARTY): StartStateCheck => ({
  settled: (view) => locationOf(view) === state.warp.location,
  underway: (view) => locationOf(view) !== 0,
  matches: (view) => mismatchesOf(view, state, party).length === 0,
  read: (view) => {
    const bad = mismatchesOf(view, state, party);
    return bad.length === 0
      ? `[Start] Start state ${state.id} read back ok (${state.flags.length} flags, location ${hex(state.warp.location)})`
      : `[Start] Start state ${state.id} MISMATCH: ${bad.join('; ')}`;
  },
});

export { createStartStateCheck };
