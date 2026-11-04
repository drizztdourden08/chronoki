/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { treasureRomIdOf } from './treasure-rom-id-of';

describe('treasureRomIdOf', { tags: ['critical'] }, () => {
  it('parses the hexadecimal id after the treasure prefix', () => {
    expect(treasureRomIdOf('treasure-1f')).toBe(0x1f);
    expect(treasureRomIdOf('treasure-ff')).toBe(0xff);
  });

  it('returns null for a key item', () => {
    expect(treasureRomIdOf('pendant')).toBeNull();
  });

  it('returns null when the suffix is not a number', () => {
    expect(treasureRomIdOf('treasure-zz')).toBeNull();
    expect(treasureRomIdOf('treasure-')).toBeNull();
  });
});
