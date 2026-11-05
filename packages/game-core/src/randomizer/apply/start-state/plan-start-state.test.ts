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
import { INTRO_JUMP, START_BLOCK_MAX_BYTES } from './start-block.constants';
import { coalescePokes } from './coalesce-pokes';
import { StartBlockTooLongError } from './start-block-too-long.error';
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
      ...join(coalescePokes([...s.pokes, ...partyPokes([0, 1])]).map((p) => encodePoke(p.at, p.value, p.width))),
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

const ALL: CtStartParty = ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla', 'magus'];
const lengthOf = (party: CtStartParty): number => buildStartBlock(STANDARD_START, party, INTRO_JUMP).length;
const OLD_BLOCK_BYTES = 83;

describe('start block party', () => {
  it('pokes only roster slots that differ from the boot state, plus the mask', { tags: ['critical'] }, () => {
    expect(partyPokes([0, 1]).map((p) => [p.at, p.value])).toEqual([[0x7e2981, 1], [0x7e29af, 0xc0]]);
    expect(partyPokes([0])).toEqual([]);
    expect(partyPokes([4, 5, 3]).map((p) => [p.at, p.value])).toEqual([[0x7e2980, 4], [0x7e2981, 5], [0x7e2982, 3], [0x7e29af, 0x1c]]);
  });

  it('Crono absent: slot 0 is poked and the mask bit 0x80 is clear', { tags: ['critical'] }, () => {
    const pokes = partyPokes(partyIdsOf(['marle']));
    expect(pokes[0]).toEqual({ at: 0x7e2980, value: 1, width: 1 });
    expect(pokes[pokes.length - 1]).toEqual({ at: 0x7e29af, value: 0x40, width: 1 });
  });

  it('stores consecutive changed bytes as words', { tags: ['critical'] }, () => {
    expect(coalescePokes([{ at: 10, value: 1, width: 1 }, { at: 11, value: 2, width: 1 }, { at: 12, value: 3, width: 1 }])).toEqual([
      { at: 10, value: 0x0201, width: 2 }, { at: 12, value: 3, width: 1 },
    ]);
  });

  it('writes no recruit done flags in any block', { tags: ['critical'] }, () => {
    const withParty = join([buildStartBlock(STANDARD_START, ALL, INTRO_JUMP)]);
    const flags = [[0x7f00a1, 0x04], [0x7f00ff, 0x10], [0x7f01df, 0x04], [0x7f0160, 0x07]];
    expect(flags.filter(([at, bits]) => hasBytes(withParty, join([encodeSetBits(at ?? 0, bits ?? 0)])))).toEqual([]);
  });

  it('legacy block stays within the budget and grows by the two party pokes only', { tags: ['critical'] }, () => {
    const length = lengthOf(LEGACY_PARTY);
    expect(length).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
    expect(length).toBeLessThanOrEqual(OLD_BLOCK_BYTES + 10);
  });

  it('7 characters with Crono first fit the budget', { tags: ['critical'] }, () => {
    expect(lengthOf(ALL)).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
    expect(() => planStartState(STANDARD_START, ALL)).not.toThrow();
  });

  it('every Crono-first subset fits, in canonical order', { tags: ['critical'] }, () => {
    for (let mask = 1; mask < 128; mask += 1) {
      const party = ALL.filter((_id, bit) => mask & (1 << bit));
      expect(() => planStartState(STANDARD_START, party)).not.toThrow();
    }
  });

  it('refuses a 7-character party with Crono in a later slot instead of writing a block the game refuses', { tags: ['critical'] }, () => {
    const party: CtStartParty = ['marle', 'crono', 'lucca', 'robo', 'frog', 'ayla', 'magus'];
    expect(lengthOf(party)).toBeGreaterThan(START_BLOCK_MAX_BYTES);
    expect(() => planStartState(STANDARD_START, party)).toThrow(StartBlockTooLongError);
  });
});
