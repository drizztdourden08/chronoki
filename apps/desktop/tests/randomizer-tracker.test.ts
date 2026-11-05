/* @layer tests @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import type { CheckDef } from '@chronoki/game-core';
import { checksCache } from '@app/game/randomizer/tracker/checks-cache';
import { locationLabelOf } from '@app/game/randomizer/tracker/location-label-of';

const checkOf = (id: string): CheckDef => ({ id, kind: 'chest', locationId: 0x1d0, vanillaItem: 1 });

describe('checksCache', { tags: ['critical'] }, () => {
  beforeEach(() => checksCache.clear());

  it('is empty before anything is remembered', () => {
    expect(checksCache.latest()).toBeNull();
  });

  it('returns the checks of the most recently remembered profile', () => {
    checksCache.remember('a', [checkOf('chest-1d0-0')]);
    checksCache.remember('b', [checkOf('chest-1d0-1'), checkOf('chest-1d0-2')]);
    expect(checksCache.latest()?.profileId).toBe('b');
    expect(checksCache.latest()?.checks).toHaveLength(2);
  });

  it('ignores an empty list so a failed read never wipes a good cache', () => {
    checksCache.remember('a', [checkOf('chest-1d0-0')]);
    checksCache.remember('b', []);
    expect(checksCache.latest()?.profileId).toBe('a');
  });
});

describe('locationLabelOf', { tags: ['critical'] }, () => {
  it('names a chest by its region, map and index', () => {
    expect(locationLabelOf('chest-1d0-2')).toBe('End of Time, map 1D0: Chest 2');
  });

  it('names a gift by its object index', () => {
    expect(locationLabelOf('gift-1d0-o3')).toBe('End of Time, map 1D0: Gift 3');
  });

  it('falls back to the map number when no region owns the map', () => {
    expect(locationLabelOf('chest-fff-1')).toBe('Map FFF: Chest 1');
  });

  it('names a key spot by its readable name', () => {
    expect(locationLabelOf('ki-mt-woe')).toBe('Mt. Woe');
  });

  it('returns an unknown key unchanged', () => {
    expect(locationLabelOf('something-else')).toBe('something-else');
  });
});
