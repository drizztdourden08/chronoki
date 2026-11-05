/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { applySeedToPack } from '../apply-seed-to-pack';
import { changeLocationTarget } from '../script/change-location-target';
import { encodeClearBits } from '../script/encode-clear-bits';
import { encodePoke } from '../script/encode-poke';
import { encodeSetBits } from '../script/encode-set-bits';
import { spliceFixture } from '../script/script-splice.fixture';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { partyIdsOf } from '../../world/party/party-ids-of';
import { buildStartBlock } from './build-start-block';
import { partyPokes } from './party-pokes';
import { planStartState } from './plan-start-state';
import { LEGACY_PARTY } from './legacy-party.constants';
import { INTRO_JUMP } from './start-block.constants';
import { CT_RECRUIT_FLAGS } from './recruit-flags.constants';
import { STANDARD_START } from './standard-start.constants';

const { POKE, RETURN, buildScript, entryBytes, packOf } = spliceFixture;
const join = (parts: Uint8Array[]): number[] => parts.flatMap((p) => [...p]);
const introPack = (): Uint8Array => packOf(buildScript([[...POKE, ...INTRO_JUMP, ...RETURN]]));

describe('planStartState', () => {
  it('replaces the 0x1F0 jump of scene 0 with the start block', { tags: ['critical'] }, () => {
    const result = applySeedToPack(introPack(), {}, [planStartState(STANDARD_START)]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const block = [...buildStartBlock(STANDARD_START, ['crono', 'marle'], INTRO_JUMP)];
    expect(entryBytes(result.bytes, 16, 7)).toEqual(buildScript([[...POKE, ...block, ...RETURN]]));
  });

  it("decodes back to the flags, pokes, the legacy roster, clears and the 0x1F1 warp", { tags: ['critical'] }, () => {
    const block = [...planStartState(STANDARD_START).replace];
    const s = STANDARD_START;
    const expected = [
      ...join(s.flags.map((f) => encodeSetBits(f.at, f.bits))),
      ...join([...s.pokes, ...partyPokes([0, 1])].map((p) => encodePoke(p.at, p.value, p.width))),
      ...join((s.clear ?? []).map((f) => encodeClearBits(f.at, f.bits))),
    ];
    expect(block.slice(0, -5)).toEqual(expected);
    const warp = Uint8Array.from(block.slice(-5));
    expect(warp[0]).toBe(0xe0);
    expect(changeLocationTarget(warp)).toBe(0x1f1);
    expect((warp[2] ?? 0) & 0x80).toBe(0x80);
    expect([warp[3], warp[4]]).toEqual([0x4e, 0x4b]);
    expect(join([encodeClearBits(0x7f0056, 0x01)])).toEqual([0x66, 0x00, 0x56]);
  });

  it('refuses a pack whose scene 0 has no jump to 0x1F0', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript([[...POKE, ...RETURN]]));
    const result = applySeedToPack(pack, {}, [planStartState(STANDARD_START)]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.failed.length).toBeGreaterThan(0);
  });

  it('leaves the pack unchanged in length terms when no splices are given', { tags: ['critical'] }, () => {
    const pack = introPack();
    const result = applySeedToPack(pack, {});
    expect(result.ok && result.bytes).toEqual(pack);
  });

  it('uses the legacy Crono + Marle party when none is given', { tags: ['critical'] }, () => {
    expect([...planStartState(STANDARD_START).replace]).toEqual([...planStartState(STANDARD_START, ['crono', 'marle']).replace]);
  });
});

const hasBytes = (block: number[], needle: number[]): boolean =>
  block.some((_, i) => needle.every((byte, j) => block[i + j] === byte));

const rosterOf = (party: CtStartParty): number[] => {
  const block = [...buildStartBlock(STANDARD_START, party, INTRO_JUMP)];
  return partyPokes(partyIdsOf(party)).map((p) => (hasBytes(block, join([encodePoke(p.at, p.value, p.width)])) ? p.value : -1));
};

describe('start block party', () => {
  it('pokes 9 roster slots in order and the joined mask', { tags: ['critical'] }, () => {
    const pokes = partyPokes([4, 5, 3, 1]);
    expect(pokes.slice(0, 9).map((p) => [p.at, p.value])).toEqual([
      [0x7e2980, 4], [0x7e2981, 5], [0x7e2982, 3], [0x7e2983, 1], [0x7e2984, 0x80], [0x7e2985, 0x80], [0x7e2986, 0x80], [0x7e2987, 0x80], [0x7e2988, 0x80],
    ]);
    expect(pokes[9]).toEqual({ at: 0x7e29af, value: 0x5c, width: 1 });
  });

  it('puts every roster poke into the decoded block', { tags: ['critical'] }, () => {
    const party: CtStartParty = ['frog', 'ayla', 'robo', 'lucca'];
    expect(rosterOf(party)).toEqual(partyPokes(partyIdsOf(party)).map((p) => p.value));
  });

  it('writes no recruit done flags while they are off', { tags: ['critical'] }, () => {
    const block = join([buildStartBlock(STANDARD_START, ['marle', 'frog', 'ayla'], INTRO_JUMP)]);
    const flagged = Object.values(CT_RECRUIT_FLAGS).flat().filter((f) => hasBytes(block, join([encodeSetBits(f.at, f.bits)])));
    expect(flagged).toEqual([]);
  });

  it('legacy default gives roster Crono, Marle, then empty slots and mask 0xC0', { tags: ['critical'] }, () => {
    const pokes = partyPokes(partyIdsOf(LEGACY_PARTY));
    expect(pokes.slice(0, 9).map((p) => p.value)).toEqual([0, 1, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80]);
    expect(pokes[9]?.value).toBe(0xc0);
  });

  it('Crono absent: slot 0 is not Crono and the mask bit 0x80 is clear', { tags: ['critical'] }, () => {
    const pokes = partyPokes(partyIdsOf(['marle']));
    expect(pokes[0]?.value).not.toBe(0);
    expect((pokes[9]?.value ?? 0) & 0x80).toBe(0);
    expect(pokes[9]?.value).toBe(0x40);
  });

  it('7 starters give 3 active and 4 reserve', { tags: ['critical'] }, () => {
    const all: CtStartParty = ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla', 'magus'];
    const pokes = partyPokes(partyIdsOf(all));
    expect(pokes.slice(0, 3).map((p) => p.value)).toEqual([0, 1, 2]);
    expect(pokes.slice(3, 7).map((p) => p.value)).toEqual([3, 4, 5, 6]);
    expect(pokes.slice(7, 9).map((p) => p.value)).toEqual([0x80, 0x80]);
    expect(pokes[9]?.value).toBe(0xfe);
  });
});
