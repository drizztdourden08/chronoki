/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { planSeedSplices } from '../plan-seed-splices';
import { LEGACY_PARTY } from '../start-state/legacy-party.constants';
import { START_BLOCK_MAX_BYTES } from '../start-state/start-block.constants';
import { endingBytesOf } from './ending-splice';

const hex = (bytes: readonly number[]): string => bytes.map((byte) => byte.toString(16).padStart(2, '0')).join(' ');

const splicesOf = (gameMode: string) => planSeedSplices({ gameMode }, LEGACY_PARTY);

const sceneOf = (gameMode: string, why: string) => {
  const found = splicesOf(gameMode).find((splice) => splice.why === why);
  if (found === undefined) throw new Error(`No splice ${why}`);
  return found;
};

describe('mode splices', () => {
  it('plans only the start block for standard', { tags: ['critical'] }, () => {
    expect(planSeedSplices({}, LEGACY_PARTY)).toHaveLength(1);
    expect(planSeedSplices({ gameMode: 'standard' }, LEGACY_PARTY)).toHaveLength(1);
  });

  it('builds the 7-byte ending as a story write plus a jump to scene 0x52', { tags: ['critical'] }, () => {
    expect(hex(endingBytesOf(0x99))).toBe('5a 99 df 52 02 00 00');
    expect(hex(endingBytesOf(0x75))).toBe('5a 75 df 52 02 00 00');
  });

  it('Legacy of Cyrus adds Magus to the reserve and ends before the last return', { tags: ['critical'] }, () => {
    const splices = splicesOf('legacy-of-cyrus');
    expect(splices.map((splice) => splice.why)).toEqual(['start-state:jot-standard', 'loc-magus-recruit', 'loc-ending']);
    const magus = sceneOf('legacy-of-cyrus', 'loc-magus-recruit');
    expect(magus.scene).toBe(0x0ac);
    expect(hex([...magus.replace])).toBe('d0 06 5a 8a');
    expect(magus.anchor(Uint8Array.of(0x5a, 0x8a))).toBe(true);
    expect(magus.anchor(Uint8Array.of(0x5a, 0x8b))).toBe(false);
    const ending = sceneOf('legacy-of-cyrus', 'loc-ending');
    expect(ending.scene).toBe(0x0b5);
    expect(hex([...ending.replace])).toBe('5a 99 df 52 02 00 00 da');
    expect(ending.anchor(Uint8Array.of(0xda))).toBe(true);
  });

  it('Ice Age deletes the three story writes and ends after the fade', { tags: ['critical'] }, () => {
    const splices = splicesOf('ice-age');
    expect(splices.map((splice) => [splice.scene, splice.replace.length])).toEqual([
      [0, splices[0]?.replace.length], [0x184, 0], [0x184, 0], [0x17e, 0], [0x18d, 10],
    ]);
    expect(sceneOf('ice-age', 'ice-age-no-story-b4').anchor(Uint8Array.of(0x5a, 0xb4))).toBe(true);
    expect(sceneOf('ice-age', 'ice-age-no-story-b7').anchor(Uint8Array.of(0x5a, 0xb7))).toBe(true);
    expect(sceneOf('ice-age', 'ice-age-no-story-bb').anchor(Uint8Array.of(0x5a, 0xbb))).toBe(true);
    expect(sceneOf('ice-age', 'ice-age-no-story-bb').anchor(Uint8Array.of(0x5a, 0xba))).toBe(false);
    expect(hex([...sceneOf('ice-age', 'ice-age-ending').replace])).toBe('eb 30 00 5a 75 df 52 02 00 00');
  });

  it('keeps the start block within the budget with the mode start flags', { tags: ['critical'] }, () => {
    for (const gameMode of ['legacy-of-cyrus', 'ice-age']) {
      expect(splicesOf(gameMode)[0]?.replace.length).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
    }
  });

  it('puts the mode start flags and the forced early pendant in the start block', { tags: ['critical'] }, () => {
    const block = (gameMode: string): string => hex([...(splicesOf(gameMode)[0]?.replace ?? [])]);
    expect(block('legacy-of-cyrus')).toContain('65 86 9e');
    expect(block('legacy-of-cyrus')).toContain('65 06 f4');
    expect(block('ice-age')).toContain('65 02 a6');
    expect(block('ice-age')).not.toContain('65 06 f4');
    expect(block('standard')).not.toContain('65 86 9e');
  });
});
