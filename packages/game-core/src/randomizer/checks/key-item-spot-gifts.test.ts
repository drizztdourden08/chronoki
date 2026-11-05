/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { planPackPlacement } from '../apply/plan-pack-placement';
import { ctPollEntries } from '../session/ct-poll-entries';
import { placementFixture } from '../world/ct-placement.fixture';
import { CT_KEY_ITEM_ROM_IDS } from '../world/ct-key-item-rom-ids.constants';
import { joinCtChecks } from '../world/join-ct-checks';
import type { CheckDef } from './check.type';
import { KEY_ITEM_SPOT_GIFTS, UNBOUND_KEY_ITEM_SPOTS } from './key-item-spot-gifts.constants';
import { spotChecksOf } from './spot-checks-of';

const giftOf = (check: string, item: number): CheckDef => ({
  id: check, kind: check.startsWith('chest-') ? 'chest' : 'gift', locationId: 1, vanillaItem: item,
});
const CHECKS: CheckDef[] = KEY_ITEM_SPOT_GIFTS.map((gift) => giftOf(gift.check, gift.item));

describe('key-item spot gifts', { tags: ['critical'] }, () => {
  it.each(KEY_ITEM_SPOT_GIFTS)('binds $spot to its gift check', ({ spot, check }) => {
    expect(spotChecksOf(CHECKS)?.get(spot)).toBe(check);
    const location = joinCtChecks({ checks: CHECKS, spotChecks: spotChecksOf(CHECKS) })
      .regions.flatMap((region) => region.locations).find((l) => l.key === spot);
    expect(location?.tags?.['checkId']).toBe(check);
  });

  it('keeps bound gifts out of the treasure locations', () => {
    expect(joinCtChecks({ checks: CHECKS, spotChecks: spotChecksOf(CHECKS) }).treasure).toEqual([]);
  });

  it('leaves the unconfirmed spots unbound', () => {
    const bound = [...(spotChecksOf(CHECKS)?.keys() ?? [])];
    expect(bound.filter((spot) => spot in UNBOUND_KEY_ITEM_SPOTS)).toEqual([]);
  });

  it('does not bind a gift whose vanilla item differs (another ROM)', () => {
    const [first] = KEY_ITEM_SPOT_GIFTS;
    expect(spotChecksOf([giftOf(first?.check ?? '', 0x01)])).toBeUndefined();
  });

  it.each(KEY_ITEM_SPOT_GIFTS)('packs a key item placed on $spot as a gift edit, not virtual', ({ spot, check }) => {
    const plan = planPackPlacement(placementFixture([[spot, 'pendant']]), CHECKS);
    expect(plan.pack).toEqual({ [check]: CT_KEY_ITEM_ROM_IDS.pendant });
    expect(plan.items.get(spot)).toBe('pendant');
    expect(plan.virtual).toEqual([]);
    expect(plan.unbound).toBe(0);
  });

  it('polls a bound gift under its spot key', () => {
    const [first] = KEY_ITEM_SPOT_GIFTS;
    if (first === undefined) throw new Error('no key-item spot gifts');
    expect(ctPollEntries(CHECKS, { [first.check]: 1 })).toEqual([{ key: first.spot, checkId: first.check }]);
  });

  it('still counts an unbound spot as virtual', () => {
    const plan = planPackPlacement(placementFixture([['ki-cyrus-grave', 'pendant']]), CHECKS);
    expect(plan.virtual).toEqual([['ki-cyrus-grave', 'pendant']]);
    expect(plan.unbound).toBe(1);
  });

  it('binds the settled spots to the gift or chest that gives their item', () => {
    const bound = spotChecksOf(CHECKS);
    expect(bound?.get('ki-zenan-bridge')).toBe('gift-078-o15-0');
    expect(bound?.get('ki-taban')).toBe('gift-004-o8-0');
    expect(bound?.get('ki-melchior-sun-stone')).toBe('gift-1b8-o23-1');
    expect(bound?.get('ki-frogs-burrow')).toBe('chest-08d-0');
  });

  it('leaves the sibling gifts of a bound function as their own checks', () => {
    const siblings = [giftOf('gift-004-o8-2', 0x79), giftOf('gift-078-o15-1', 0xcd), giftOf('gift-1b8-o23-0', 0xbb)];
    const treasure = joinCtChecks({ checks: [...CHECKS, ...siblings], spotChecks: spotChecksOf(CHECKS) }).treasure;
    expect(treasure.map((location) => location.key)).toEqual(siblings.map((check) => check.id));
  });

  it('skips a pinned source that holds its vanilla item: not packed, not virtual', () => {
    const sources = [giftOf('gift-1d0-o0', 0xd9), giftOf('gift-1b8-o2', 0xd8)];
    const placement = placementFixture([['gift-1d0-o0', 'c-trigger'], ['gift-1b8-o2', 'prism-shard']]);
    expect(planPackPlacement(placement, [...CHECKS, ...sources])).toEqual({ pack: {}, items: new Map(), virtual: [], unbound: 0 });
  });

  it('no longer treats a giver-less spot as pinned', () => {
    const plan = planPackPlacement(placementFixture([['ki-sunken-desert', 'c-trigger']]), CHECKS);
    expect(plan.virtual).toEqual([['ki-sunken-desert', 'c-trigger']]);
  });

  it('still reports another item on an unbound spot as virtual', () => {
    const plan = planPackPlacement(placementFixture([['ki-geno-dome', 'pendant']]), CHECKS);
    expect(plan.virtual).toEqual([['ki-geno-dome', 'pendant']]);
    expect(plan.unbound).toBe(1);
  });
});
