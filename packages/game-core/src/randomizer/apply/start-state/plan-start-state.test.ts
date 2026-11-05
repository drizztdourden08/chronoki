/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { applySeedToPack } from '../apply-seed-to-pack';
import { changeLocationTarget } from '../script/change-location-target';
import { encodeClearBits } from '../script/encode-clear-bits';
import { encodeJoin } from '../script/encode-join';
import { encodePoke } from '../script/encode-poke';
import { encodeReserveAdd } from '../script/encode-reserve-add';
import { encodeSetBits } from '../script/encode-set-bits';
import { spliceFixture } from '../script/script-splice.fixture';
import { buildStartBlock } from './build-start-block';
import { planStartState } from './plan-start-state';
import { INTRO_JUMP } from './start-block.constants';
import { STANDARD_START } from './standard-start.constants';

const { POKE, RETURN, buildScript, entryBytes, packOf } = spliceFixture;
const join = (parts: Uint8Array[]): number[] => parts.flatMap((p) => [...p]);
const introPack = (): Uint8Array => packOf(buildScript([[...POKE, ...INTRO_JUMP, ...RETURN]]));

describe('planStartState', () => {
  it('replaces the 0x1F0 jump of scene 0 with the start block', { tags: ['critical'] }, () => {
    const result = applySeedToPack(introPack(), {}, [planStartState(STANDARD_START)]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const block = [...buildStartBlock(STANDARD_START, INTRO_JUMP)];
    expect(entryBytes(result.bytes, 16, 7)).toEqual(buildScript([[...POKE, ...block, ...RETURN]]));
  });

  it('decodes back to the flags, clears, pokes, the Marle join and the 0x1F1 warp', { tags: ['critical'] }, () => {
    const block = [...planStartState(STANDARD_START).replace];
    const s = STANDARD_START;
    const expected = [
      ...join(s.flags.map((f) => encodeSetBits(f.at, f.bits))),
      ...join(s.pokes.map((p) => encodePoke(p.at, p.value, p.width))),
      ...join([encodeReserveAdd(1), encodeJoin(1)]),
      ...join((s.clear ?? []).map((f) => encodeClearBits(f.at, f.bits))),
    ];
    expect(block.slice(0, -5)).toEqual(expected);
    const warp = Uint8Array.from(block.slice(-5));
    expect(warp[0]).toBe(0xe0);
    expect(changeLocationTarget(warp)).toBe(0x1f1);
    expect(warp[2] & 0x80).toBe(0x80);
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
});
