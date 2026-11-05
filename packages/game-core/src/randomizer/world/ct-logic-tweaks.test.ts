/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../checks/check.type';
import { spotGiftChecksOf } from '../checks/spot-gift-checks-of';
import { createCtWorldDef } from './create-ct-world-def';
import { ctOptionValues } from './ct-option-values';
import type { CtWorldInput } from './ct-world-input.type';
import { keyItemsOf } from './epoch-fail/key-items-of';
import { modeOf } from './modes/mode-of';
import { pinRoboRibbon } from './pin-robo-ribbon';
import { eligibleObjectivesOf } from './bucket/eligible-objectives-of';
import { LEGACY_PARTY } from './recruits/legacy-party.constants';

const RIBBON = 0xb8;

const chest = (n: number, vanillaItem: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: 0x087, vanillaItem,
});

const inputOf = (options: CtWorldInput['options'] = {}): CtWorldInput => ({
  checks: [chest(0, 0x10), chest(1, RIBBON), chest(2, 0x12)],
  options,
});

const locationKeys = (input: CtWorldInput): string[] =>
  createCtWorldDef(input).regions.flatMap((region) => region.locations.map((location) => location.key));

const objectiveIdsOf = (options: Parameters<typeof eligibleObjectivesOf>[0]): string[] =>
  eligibleObjectivesOf(options, LEGACY_PARTY).map((objective) => objective.id);

describe('spot gift checks', () => {
  it('exist only for the switched-on spots', { tags: ['critical'] }, () => {
    expect(spotGiftChecksOf({})).toEqual([]);
    expect(spotGiftChecksOf(undefined)).toEqual([]);
    expect(spotGiftChecksOf({ addCyrusGraveSpot: true }).map((check) => check.id)).toEqual(['ki-cyrus-grave']);
    expect(spotGiftChecksOf({ addCyrusGraveSpot: true, addOzzieSpot: true }).map((check) => check.id))
      .toEqual(['ki-cyrus-grave', 'ki-ozzies-fort']);
  });

  it('are gift checks bound to their spot, so they are not also treasure', { tags: ['critical'] }, () => {
    const spots = spotGiftChecksOf({ addOzzieSpot: true });
    const input: CtWorldInput = {
      ...inputOf({ addOzzieSpot: true }),
      checks: [chest(0, 0x10), ...spots],
      spotChecks: new Map([['ki-ozzies-fort', 'ki-ozzies-fort']]),
    };
    const keys = locationKeys(input);
    expect(keys.filter((key) => key === 'ki-ozzies-fort')).toHaveLength(1);
    const location = createCtWorldDef(input).regions.flatMap((r) => r.locations).find((l) => l.key === 'ki-ozzies-fort');
    expect(location?.tags?.checkId).toBe('ki-ozzies-fort');
    expect(location?.tags?.checkKind).toBe('gift');
  });
});

describe('vanilla Robo Ribbon (superseded: always on)', () => {
  it('keeps the ribbon out of the pool and drops a ribbon check, whatever the override', { tags: ['critical'] }, () => {
    expect(ctOptionValues({ vanillaRoboRibbon: false }).vanillaRoboRibbon).toBe(true);
    [inputOf(), inputOf({ vanillaRoboRibbon: false })].forEach((input) => {
      expect(createCtWorldDef(input).buildPool({} as never).progression).not.toContain('robo-ribbon');
      const keys = locationKeys(input);
      expect(keys).not.toContain('chest-test-1');
      expect(keys).toEqual(expect.arrayContaining(['chest-test-0', 'chest-test-2']));
    });
  });

  it('never offers a Collect Robo Ribbon objective', { tags: ['critical'] }, () => {
    [{}, { vanillaRoboRibbon: false }].forEach((options) => {
      expect(objectiveIdsOf(options)).not.toContain('collect-robo-ribbon');
    });
  });

  it('filters only checks that hold the ribbon', { tags: ['critical'] }, () => {
    expect(pinRoboRibbon([chest(0, 0x10), chest(1, RIBBON)]).map((check) => check.id)).toEqual(['chest-test-0']);
  });

  it('removes only the ribbon from the key items', { tags: ['critical'] }, () => {
    const mode = modeOf({});
    expect(keyItemsOf(mode, false, true)).toEqual(mode.keyItems.filter((item) => item !== 'robo-ribbon'));
    expect(keyItemsOf(mode, true, true)).toEqual([...mode.keyItems.filter((item) => item !== 'robo-ribbon'), 'jets-of-time']);
    expect(keyItemsOf(mode, false)).toBe(mode.keyItems);
  });
});
