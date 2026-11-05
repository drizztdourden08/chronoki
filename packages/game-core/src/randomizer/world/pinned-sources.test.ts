/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { KEY_ITEM_SPOT_GIFTS } from '../checks/key-item-spot-gifts.constants';
import type { CheckDef } from '../checks/check.type';
import { createCtWorldDef } from './create-ct-world-def';
import type { CtItem, CtRegionId } from './ct-world-keys.type';
import { keyItemsOf } from './epoch-fail/key-items-of';
import { applyModeToRegions } from './modes/apply-mode-to-regions';
import type { CtModeDef } from './modes/ct-mode-def.type';
import { ICE_AGE_MODE } from './modes/ice-age-mode.constants';
import { LOST_WORLDS_MODE } from './modes/lost-worlds-mode.constants';
import { STANDARD_MODE } from './modes/standard-mode.constants';
import { isPinnedPlacement } from './is-pinned-placement';
import { pinnedSourcesOf } from './pinned-sources-of';
import { CT_REGIONS } from './regions/ct-regions.constants';
import { unpinnedKeyItems } from './unpinned-key-items';

const keptOf = (mode: CtModeDef): Set<CtRegionId> => new Set(applyModeToRegions(CT_REGIONS, mode).map((spec) => spec.id));
const GIVER_LESS = ['ki-giants-claw', 'ki-geno-dome', 'ki-sunken-desert'];
const locationPairsOf = (region: { id: string; locations: readonly { key: string }[] }): string[][] =>
  region.locations.map((location) => [location.key, region.id]);
const chest = (n: number): CheckDef => ({ id: `chest-087-${n}`, kind: 'chest', locationId: 0x087, vanillaItem: 0x10 + n });

describe('pinned sources', { tags: ['critical'] }, () => {
  it('pins the Chrono Trigger to Gaspar and the Prism Shard to Guardia Castle in standard', () => {
    const sources = pinnedSourcesOf(STANDARD_MODE.keyItems, keptOf(STANDARD_MODE));
    expect(sources.map((source) => [source.key, source.item, source.region])).toEqual([
      ['gift-1d0-o0', 'c-trigger', 'end-of-time'], ['gift-1b8-o2', 'prism-shard', 'present'],
    ]);
  });

  it('leaves the Chrono Trigger in the pool when the Ocean Palace is gone, since Gaspar can never give it', () => {
    const sources = pinnedSourcesOf(ICE_AGE_MODE.keyItems, keptOf(ICE_AGE_MODE));
    expect(sources.map((source) => source.item)).toEqual(['prism-shard']);
  });

  it('pins nothing that is not a key item of the mode or whose region is dropped', () => {
    const sources = pinnedSourcesOf(LOST_WORLDS_MODE.keyItems, keptOf(LOST_WORLDS_MODE));
    expect(sources.map((source) => source.item)).not.toContain('prism-shard');
  });

  it('removes one copy of each pinned item from the key items', () => {
    expect(unpinnedKeyItems(['pendant', 'c-trigger', 'c-trigger'], [['gift-1d0-o0', 'c-trigger']])).toEqual(['pendant', 'c-trigger']);
    expect(unpinnedKeyItems(['pendant'], [['gift-1b8-o2', 'prism-shard']])).toEqual(['pendant']);
  });

  it('matches a pinned placement only on its source with its vanilla item', () => {
    expect(isPinnedPlacement('gift-1d0-o0', 'c-trigger')).toBe(true);
    expect(isPinnedPlacement('gift-1b8-o2', 'prism-shard')).toBe(true);
    expect(isPinnedPlacement('gift-1d0-o0', 'pendant')).toBe(false);
    expect(isPinnedPlacement('ki-sunken-desert', 'c-trigger')).toBe(false);
    expect(isPinnedPlacement('ki-giants-claw', 'prism-shard')).toBe(false);
  });

  it('places the pinned items on their sources in the first phase, with the source rule', () => {
    const def = createCtWorldDef({ checks: [], options: { gameMode: 'standard' } });
    const progression = def.buildPool({} as never).progression;
    (['prism-shard', 'robo-ribbon', 'c-trigger'] as const).forEach((item) => expect(progression).not.toContain(item));
    const placedItems = new Map<string, CtItem>();
    void def.fillPhases?.[0]?.run({ world: { placedItems } } as never, {} as never);
    expect(Object.fromEntries(placedItems)).toEqual({ 'gift-1d0-o0': 'c-trigger', 'gift-1b8-o2': 'prism-shard' });
    const locations = def.regions.flatMap(locationPairsOf);
    expect(locations).toEqual(expect.arrayContaining([['gift-1d0-o0', 'end-of-time'], ['gift-1b8-o2', 'present']]));
    expect(def.locationRules?.get('gift-1d0-o0')).toBeDefined();
    expect(def.locationRules?.get('gift-1b8-o2')).toBeDefined();
  });

  it('lets the giver-less spots hold treasure only, never a key item', () => {
    const rules = createCtWorldDef({ checks: [], options: { gameMode: 'standard' } }).itemRules;
    GIVER_LESS.forEach((spot) => {
      expect(rules?.get(spot)?.('pendant')).toBe(false);
      expect(rules?.get(spot)?.('treasure-10')).toBe(true);
    });
  });

  it('balances the pool against every open location', () => {
    const def = createCtWorldDef({ checks: [chest(0), chest(1), chest(2)], options: { gameMode: 'standard' } });
    const pool = def.buildPool({} as never);
    const open = def.regions.flatMap((region) => region.locations).length - 2;
    expect(pool.progression.length + pool.rest.length).toBe(open);
  });

  it('leaves no more key items than bound spots with chronosanity off', () => {
    const pins = pinnedSourcesOf(STANDARD_MODE.keyItems, keptOf(STANDARD_MODE)).map((source): [string, CtItem] => [source.key, source.item]);
    expect(unpinnedKeyItems(keyItemsOf(STANDARD_MODE, false, true), pins).length).toBeLessThanOrEqual(KEY_ITEM_SPOT_GIFTS.length);
    expect(unpinnedKeyItems(keyItemsOf(STANDARD_MODE, true, true), pins).length).toBeLessThanOrEqual(KEY_ITEM_SPOT_GIFTS.length);
  });
});
