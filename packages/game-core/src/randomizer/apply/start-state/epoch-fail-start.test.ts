/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { fitStartParty } from './fit-start-party';
import { LOST_WORLDS_START } from './lost-worlds-start.constants';
import { planEarlyFlagsSplice } from './plan-early-flags-splice';
import { planStartSplices } from './plan-start-splices';
import { planStartState } from './plan-start-state';
import { STANDARD_START } from './standard-start.constants';
import { START_BLOCK_MAX_BYTES } from './start-block.constants';
import { startStateOf } from './start-state-of';
import { withEpochFail } from './with-epoch-fail';
import { withStartOptions } from './with-start-options';

const ALL: CtStartParty = ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla', 'magus'];
const EF = { epochFail: true, earlyPendantCharge: true };

describe('withEpochFail', () => {
  it('returns the very same state with the option off', { tags: ['critical'] }, () => {
    expect(withEpochFail(STANDARD_START, {})).toBe(STANDARD_START);
    expect(withEpochFail(STANDARD_START, { epochFail: false })).toBe(STANDARD_START);
  });

  it('swaps the winged Epoch start for the wingless Leene Square one', { tags: ['critical'] }, () => {
    const state = withEpochFail(STANDARD_START, { epochFail: true });
    expect(state.flags).not.toContainEqual({ at: 0x7f00ba, bits: 0x80 });
    expect(state.flags).toEqual(expect.arrayContaining([
      { at: 0x7f00ec, bits: 0x04 }, { at: 0x7f00ee, bits: 0x80 }, { at: 0x7f00ef, bits: 0x10 },
      { at: 0x7f01f0, bits: 0x01 }, { at: 0x7f01a3, bits: 0x02 },
    ]));
    const poke = (at: number) => state.pokes.filter((p) => p.at === at);
    expect(poke(0x7e027e)).toEqual([{ at: 0x7e027e, value: 0, width: 1 }]);
    expect(poke(0x7e028f)).toEqual([{ at: 0x7e028f, value: 0, width: 1 }]);
    expect(poke(0x7e0294)).toEqual([{ at: 0x7e0294, value: 0x80, width: 1 }]);
    expect(poke(0x7e029f)).toEqual([{ at: 0x7e029f, value: 0x1f0, width: 2 }]);
    expect(state.warp).toMatchObject({ location: 0x1b7, x: 0x18, y: 0x04, facing: 1 });
  });

  it('is wired after the option flags and ignored in Lost Worlds', { tags: ['critical'] }, () => {
    expect(startStateOf(EF).warp.location).toBe(0x1b7);
    expect(startStateOf(EF).flags).toContainEqual({ at: 0x7f00f4, bits: 0x40 });
    expect(startStateOf({ ...EF, gameMode: 'lost-worlds' }).warp.location).toBe(0x1f2);
  });
});

describe('start block split', () => {
  it('leaves standard as one block with no early splice', { tags: ['critical'] }, () => {
    expect(planEarlyFlagsSplice(STANDARD_START, ALL)).toBeNull();
    expect(planStartSplices(STANDARD_START, ALL)).toEqual([planStartState(STANDARD_START, ALL)]);
  });

  it('fits Epoch Fail, the pendant and a 7-member party in two parts', { tags: ['critical'] }, () => {
    const state = withStartOptions(STANDARD_START, EF);
    const party = fitStartParty(ALL, EF);
    const [early, late] = planStartSplices(state, party);
    expect(early?.why).toBe('start-flags:jot-standard');
    expect(early?.replace.slice(-2)).toEqual(Uint8Array.of(0x10, 0x1a));
    expect(early?.anchor(Uint8Array.of(0x10, 0x1a))).toBe(true);
    expect(late?.replace.length).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
  });

  it('keeps the flags the new-game code rewrites in the late block', { tags: ['critical'] }, () => {
    const state = withStartOptions(STANDARD_START, EF);
    const late = planStartState(state, ALL).replace;
    expect(late.length).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
    expect([...late.slice(0, 3)]).toEqual([0x65, 0x07, 0x57]);
  });

  it('splits Lost Worlds too, fitting any party size', { tags: ['critical'] }, () => {
    for (let size = 1; size <= 7; size += 1) {
      const party = ALL.slice(0, size);
      expect(() => planStartSplices(LOST_WORLDS_START, fitStartParty(party, { gameMode: 'lost-worlds' }))).not.toThrow();
    }
  });
});
