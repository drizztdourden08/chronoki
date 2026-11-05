/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { GOLD } from '../../game-info/wram-map.constants';
import { HARD_START_GOLD } from '../world/treasure-tiers/treasure-tiers.constants';
import { createStartGoldGrant } from './create-start-gold-grant';

const recorder = (accept = true) => {
  const writes: { offset: number; bytes: number[] }[] = [];
  const write = (offset: number, bytes: Uint8Array): boolean => {
    if (accept) writes.push({ offset, bytes: [...bytes] });
    return accept;
  };
  return { writes, write };
};

describe('createStartGoldGrant', { tags: ['critical'] }, () => {
  it('writes 24-bit little-endian gold at the gold address once the game starts', () => {
    const { writes, write } = recorder();
    const grant = createStartGoldGrant(write, HARD_START_GOLD);
    expect(grant.observe(false)).toBe(false);
    expect(writes).toEqual([]);
    expect(grant.observe(true)).toBe(true);
    expect(writes).toEqual([{ offset: GOLD, bytes: [0x10, 0x27, 0x00] }]);
  });

  it('grants only once', () => {
    const { writes, write } = recorder();
    const grant = createStartGoldGrant(write, HARD_START_GOLD);
    grant.observe(true);
    grant.observe(true);
    expect(writes).toHaveLength(1);
  });

  it('retries when the write was refused, and grants again after reset', () => {
    const refused = recorder(false);
    const grant = createStartGoldGrant(refused.write, 5);
    expect(grant.observe(true)).toBe(false);
    expect(grant.granted()).toBe(false);
    const ok = recorder();
    const again = createStartGoldGrant(ok.write, 5);
    again.observe(true);
    again.reset();
    again.observe(true);
    expect(ok.writes).toHaveLength(2);
  });
});
