/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { hpGrowByte } from './hp-grow-byte.fixture';
import { levelRecord } from './level-record';
import { HP_GROW_ROM, MP_GROW_ROM, STAT_RATE_ROM } from './level-record.constants';
import { mpGrowByte } from './mp-grow-byte.fixture';
import { rateByte } from './rate-byte.fixture';
import { synthRecord } from './synth-record.fixture';

const rom = (addr: number): number | undefined => {
  if (addr >= HP_GROW_ROM && addr < MP_GROW_ROM) return hpGrowByte(addr - HP_GROW_ROM);
  if (addr >= MP_GROW_ROM && addr < STAT_RATE_ROM) return mpGrowByte(addr - MP_GROW_ROM);
  if (addr >= STAT_RATE_ROM && addr < STAT_RATE_ROM + 56) return rateByte(addr - STAT_RATE_ROM);
  return undefined;
};

const maxHp = (r: Uint8Array | null): number => (r?.[0x05] ?? 0) | ((r?.[0x06] ?? 0) << 8);

describe('levelRecord', { tags: ['critical'] }, () => {
  it('adds the gains of every level passed and recomputes stats from the base', () => {
    const out = levelRecord(Uint8Array.from(synthRecord(0)), 0, 12, rom);
    expect(out?.[0x12]).toBe(12);
    expect(maxHp(out)).toBe(100 + 9 * 2 + 2 * 3);
    expect(out?.[0x09]).toBe(10 + 11);
    expect(out?.[0x0b]).toBe(5 + Math.floor((10 * 11) / 100));
    expect(out?.[0x03]).toBe(out?.[0x05]);
    expect(out?.[0x07]).toBe(out?.[0x09]);
  });

  it('removes the gains when levelling down and leaves XP and NEXT alone', () => {
    const record = Uint8Array.from(synthRecord(2));
    const out = levelRecord(record, 2, 1, rom);
    expect(maxHp(out)).toBe(100 - 6 * 2);
    expect(out?.[0x13]).toBe(record[0x13]);
    expect(out?.[0x2b]).toBe(record[0x2b]);
  });

  it('returns null when the growth tables are missing', () => {
    expect(levelRecord(Uint8Array.from(synthRecord(0)), 0, 5, () => undefined)).toBeNull();
  });
});
