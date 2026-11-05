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

const giftOf = (check: string, item: number): CheckDef => ({ id: check, kind: 'gift', locationId: 1, vanillaItem: item });
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
    const plan = planPackPlacement(placementFixture([['ki-taban', 'pendant']]), CHECKS);
    expect(plan.virtual).toEqual([['ki-taban', 'pendant']]);
    expect(plan.unbound).toBe(1);
  });
});
