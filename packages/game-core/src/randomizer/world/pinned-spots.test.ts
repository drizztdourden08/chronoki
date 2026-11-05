/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { KEY_ITEM_SPOT_GIFTS } from '../checks/key-item-spot-gifts.constants';
import { createCtWorldDef } from './create-ct-world-def';
import type { CtItem, CtSpotId } from './ct-world-keys.type';
import { keyItemsOf } from './epoch-fail/key-items-of';
import { LOST_WORLDS_MODE } from './modes/lost-worlds-mode.constants';
import { STANDARD_MODE } from './modes/standard-mode.constants';
import { isPinnedPlacement } from './is-pinned-placement';
import { pinnedSpotsOf } from './pinned-spots-of';
import { unpinnedKeyItems } from './unpinned-key-items';

const PINNED: CtSpotId[] = ['ki-giants-claw', 'ki-geno-dome', 'ki-sunken-desert'];
const SPOTS: CtSpotId[] = ['ki-taban', ...PINNED];

describe('pinned vanilla spots', { tags: ['critical'] }, () => {
  it('pins the three item-less spots to their vanilla item in standard', () => {
    expect(pinnedSpotsOf(SPOTS, STANDARD_MODE.keyItems)).toEqual([
      ['ki-giants-claw', 'prism-shard'], ['ki-geno-dome', 'robo-ribbon'], ['ki-sunken-desert', 'c-trigger'],
    ]);
  });

  it('does not pin a spot whose vanilla item is not a key item of the mode', () => {
    const pins = pinnedSpotsOf(SPOTS, LOST_WORLDS_MODE.keyItems);
    expect(pins.map(([spot]) => spot)).not.toContain('ki-geno-dome');
  });

  it('removes one copy of each pinned item from the key items', () => {
    expect(unpinnedKeyItems(['pendant', 'c-trigger', 'c-trigger'], [['ki-sunken-desert', 'c-trigger']]))
      .toEqual(['pendant', 'c-trigger']);
    expect(unpinnedKeyItems(['pendant'], [['ki-geno-dome', 'robo-ribbon']])).toEqual(['pendant']);
  });

  it('matches a pinned placement only with its vanilla item', () => {
    expect(isPinnedPlacement('ki-giants-claw', 'prism-shard')).toBe(true);
    expect(isPinnedPlacement('ki-giants-claw', 'pendant')).toBe(false);
    expect(isPinnedPlacement('ki-taban', 'prism-shard' as CtItem)).toBe(false);
  });

  it('keeps the pinned items out of the standard pool and places them in the first phase', () => {
    const def = createCtWorldDef({ checks: [], options: { gameMode: 'standard' } });
    const progression = def.buildPool({} as never).progression;
    expect(progression).not.toContain('prism-shard');
    expect(progression).not.toContain('robo-ribbon');
    expect(progression).not.toContain('c-trigger');
    const placedItems = new Map<string, CtItem>();
    void def.fillPhases?.[0]?.run({ world: { placedItems } } as never);
    expect(Object.fromEntries(placedItems)).toEqual({
      'ki-giants-claw': 'prism-shard', 'ki-geno-dome': 'robo-ribbon', 'ki-sunken-desert': 'c-trigger',
    });
  });

  it('leaves no more key items than bound spots with chronosanity off', () => {
    const pins = pinnedSpotsOf(PINNED, STANDARD_MODE.keyItems);
    expect(unpinnedKeyItems(keyItemsOf(STANDARD_MODE, false, false), pins).length).toBeLessThanOrEqual(KEY_ITEM_SPOT_GIFTS.length);
    expect(unpinnedKeyItems(keyItemsOf(STANDARD_MODE, true, false), pins).length).toBeLessThanOrEqual(KEY_ITEM_SPOT_GIFTS.length);
  });
});
