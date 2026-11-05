/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { VERIFY_OPTION_SETS } from '../../verify/verify-option-sets.constants';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyModeToRegions } from './apply-mode-to-regions';
import { modeOf } from './mode-of';

const options = { gameMode: 'lost-worlds' };
const regions = applyModeToRegions(CT_REGIONS, modeOf(options));
const keySpots = regions.flatMap((region) => region.spots.map((spot) => spot.id));
const exitsOf = (id: string): string[] => (regions.find((region) => region.id === id)?.exits ?? []).map((exit) => exit.to);

describe('lost worlds mode', () => {
  it('is selectable and starts in the future', { tags: ['critical'] }, () => {
    expect(modeOf(options).start).toBe('future');
    expect(regions.some((region) => region.id === 'future')).toBe(true);
  });

  it('has no present or middle ages region or spot', { tags: ['critical'] }, () => {
    expect(regions.some((region) => region.era === 'present' || region.era === 'middle-ages')).toBe(false);
    expect(keySpots.some((spot) => ['ki-zenan-bridge', 'ki-kings-trial', 'ki-taban'].includes(spot))).toBe(false);
  });

  it('has exactly one key item spot per key item', { tags: ['critical'] }, () => {
    expect([...keySpots].sort()).toEqual(['ki-arris-dome', 'ki-geno-dome', 'ki-mt-woe', 'ki-reptite-lair', 'ki-sun-palace']);
    expect(modeOf(options).keyItems).toHaveLength(keySpots.length);
  });

  it('reaches every era from the future without a key', { tags: ['critical'] }, () => {
    expect(exitsOf('future')).toEqual(expect.arrayContaining(['prehistory', 'dark-ages']));
    expect(exitsOf('prehistory')).toContain('dark-ages');
  });

  it('appears as a verify option set', { tags: ['critical'] }, () => {
    expect(VERIFY_OPTION_SETS.some((set) => set.options.gameMode === 'lost-worlds')).toBe(true);
  });
});
