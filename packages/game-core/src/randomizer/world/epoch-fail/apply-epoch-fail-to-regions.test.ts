/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyEpochFailToRegions } from './apply-epoch-fail-to-regions';
import { FLIGHT_EXITS, FLIGHT_SPOTS, JETS_ROM_ID } from './epoch-fail-flight.constants';
import { keyItemsOf } from './key-items-of';
import { modeOf } from '../modes/mode-of';
import { treasureRomIdOf } from '../treasure-rom-id-of';

const patched = applyEpochFailToRegions(CT_REGIONS);
const spotsOf = (regions: typeof CT_REGIONS) => regions.flatMap((region) => region.spots);
const mentionsJets = (rule: unknown): boolean => JSON.stringify(rule ?? null).includes('jets-of-time');

describe('applyEpochFailToRegions', { tags: ['critical'] }, () => {
  it('requires the Jets of Time at every flight spot and only there', () => {
    const before = new Map(spotsOf(CT_REGIONS).map((spot) => [spot.id, spot]));
    spotsOf(patched).forEach((spot) => {
      expect(mentionsJets(spot.rule)).toBe(FLIGHT_SPOTS.includes(spot.id));
      if (!FLIGHT_SPOTS.includes(spot.id)) expect(spot).toBe(before.get(spot.id));
    });
    FLIGHT_SPOTS.forEach((id) => expect(before.has(id)).toBe(true));
  });

  it('requires them on the flight exits and leaves the other exits alone', () => {
    FLIGHT_EXITS.forEach((flight) => {
      const exit = patched.find((region) => region.id === flight.from)?.exits.find((candidate) => candidate.to === flight.to);
      expect(mentionsJets(exit?.rule)).toBe(true);
    });
    const exits = patched.flatMap((region) => region.exits.filter((exit) => mentionsJets(exit.rule)));
    expect(exits).toHaveLength(FLIGHT_EXITS.length);
  });

  it('leaves the regions untouched when the input is not patched', () => {
    expect(spotsOf(CT_REGIONS).some((spot) => mentionsJets(spot.rule))).toBe(false);
  });
});

describe('Jets of Time item', { tags: ['critical'] }, () => {
  it('joins the key item pool only with the option on', () => {
    expect(keyItemsOf(modeOf({}), false)).toBe(modeOf({}).keyItems);
    expect(keyItemsOf(modeOf({}), true)).toEqual([...modeOf({}).keyItems, 'jets-of-time']);
  });

  it('is written to chests as ROM id 0xEA', () => {
    expect(treasureRomIdOf('jets-of-time')).toBe(JETS_ROM_ID);
    expect(JETS_ROM_ID).toBe(0xea);
  });
});
