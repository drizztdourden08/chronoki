/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { GOLD } from '../../game-info/wram-map.constants';
import { HARD_START_GOLD } from '../world/treasure-tiers/treasure-tiers.constants';
import { createStartGoldGrant } from './create-start-gold-grant';
import { fakeView } from './memory-view.fake';
import { GOLD_WAIT_MAX_POLLS } from './session.constants';

const fixture = (accept = true) => {
  const ram: Record<number, number> = {};
  const writes: { offset: number; bytes: number[] }[] = [];
  const view = fakeView(ram);
  const write = (offset: number, bytes: Uint8Array): boolean => {
    if (!accept) return false;
    writes.push({ offset, bytes: [...bytes] });
    bytes.forEach((b, i) => {
      ram[offset + i] = b;
    });
    return true;
  };
  const gameWritesStartGold = (): void => {
    ram[GOLD] = 0x90;
    ram[GOLD + 1] = 0x01;
  };
  return { writes, view, write, gameWritesStartGold };
};

describe('createStartGoldGrant', { tags: ['critical'] }, () => {
  it('waits for the game own starting gold, then writes 24-bit little-endian gold', () => {
    const { writes, view, write, gameWritesStartGold } = fixture();
    const grant = createStartGoldGrant(write, HARD_START_GOLD);
    expect(grant.observe(false, view)).toBe(false);
    expect(grant.observe(true, view)).toBe(false);
    expect(writes).toEqual([]);
    gameWritesStartGold();
    expect(grant.observe(true, view)).toBe(true);
    expect(writes).toEqual([{ offset: GOLD, bytes: [0x10, 0x27, 0x00] }]);
  });

  it('writes anyway after the poll limit when gold never becomes non-zero', () => {
    const { writes, view, write } = fixture();
    const grant = createStartGoldGrant(write, HARD_START_GOLD);
    for (let i = 0; i < GOLD_WAIT_MAX_POLLS - 1; i += 1) grant.observe(true, view);
    expect(writes).toEqual([]);
    expect(grant.observe(true, view)).toBe(true);
    expect(writes).toHaveLength(1);
  });

  it('grants only once', () => {
    const { writes, view, write, gameWritesStartGold } = fixture();
    const grant = createStartGoldGrant(write, HARD_START_GOLD);
    gameWritesStartGold();
    grant.observe(true, view);
    grant.observe(true, view);
    expect(writes).toHaveLength(1);
  });

  it('retries when the write was refused, and grants again after reset', () => {
    const refused = fixture(false);
    refused.gameWritesStartGold();
    const grant = createStartGoldGrant(refused.write, 5);
    expect(grant.observe(true, refused.view)).toBe(false);
    expect(grant.granted()).toBe(false);
    const ok = fixture();
    ok.gameWritesStartGold();
    const again = createStartGoldGrant(ok.write, 5);
    again.observe(true, ok.view);
    again.reset();
    ok.gameWritesStartGold();
    again.observe(true, ok.view);
    expect(ok.writes).toHaveLength(2);
  });
});
