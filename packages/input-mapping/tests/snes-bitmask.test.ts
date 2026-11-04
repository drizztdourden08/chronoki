/* @layer test @kind test */
import { describe, it, expect } from 'vitest';
import type { SnesButton } from '../src';
import { KEYBOARD_DEFAULT, SNES_BUTTONS, SNES_BUTTON_BITS, buildProfileMaps, computeBitmask, profileFromPreset } from '../src';

const SNES12_ORDER: SnesButton[] = ['B', 'Y', 'Select', 'Start', 'Up', 'Down', 'Left', 'Right', 'A', 'X', 'L', 'R'];

describe('snes12 bit order', { tags: ['critical'] }, () => {
  it('numbers B Y Select Start Up Down Left Right A X L R from bit 0 to bit 11', () => {
    SNES12_ORDER.forEach((button, bit) => expect(SNES_BUTTON_BITS[button]).toBe(bit));
  });

  it('covers every SNES button exactly once', () => {
    expect(new Set(Object.values(SNES_BUTTON_BITS)).size).toBe(SNES_BUTTONS.length);
    expect([...SNES_BUTTONS].sort()).toEqual([...SNES12_ORDER].sort());
  });
});

describe('keyboard default through buildProfileMaps and computeBitmask', { tags: ['critical'] }, () => {
  const maps = buildProfileMaps(profileFromPreset(KEYBOARD_DEFAULT));
  const mask = (codes: string[]) =>
    computeBitmask({
      keyStates: new Map(codes.map((c) => [c, true])),
      keyboardMap: maps.keyboardMap,
      gamepadButtonMap: maps.gamepadButtonMap,
      gamepadAxisMap: maps.gamepadAxisMap,
      hidStates: new Map(),
      allowed: maps.allowed,
    });

  it('maps D to A and S to B', () => {
    expect(mask(['KeyD'])).toBe(1 << 8);
    expect(mask(['KeyS'])).toBe(1 << 0);
  });

  it('combines keys with OR', () => {
    expect(mask(['ArrowUp', 'ArrowRight', 'Enter'])).toBe((1 << 4) | (1 << 7) | (1 << 3));
  });

  it('is empty with no keys held', () => {
    expect(mask([])).toBe(0);
  });
});
