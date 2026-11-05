/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { deriveChestChecks } from '../checks/derive-chest-checks';
import { itemRomFixture } from '../world/treasure-tiers/item-rom.fixture';
import type { ItemDifficulty } from '../world/treasure-tiers/treasure-tier.type';
import { planChestEdits } from './plan-chest-edits';

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];

const buildPack = (tables: { id: number; data: number[] }[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(tables.length)];
  let at = 12 + tables.length * 16;
  tables.forEach((t) => {
    bytes.push(...le32(37), ...le32(t.id), ...le32(at), ...le32(t.data.length));
    at += t.data.length;
  });
  tables.forEach((t) => bytes.push(...t.data));
  return Uint8Array.from(bytes);
};

const VANILLA = [1, 2, 3, 0xd6];

const syntheticPack = (withItems = true): Uint8Array => {
  const pointers: number[] = [];
  for (let i = 0; i < 513; i += 1) pointers.push(...le16(i <= 5 ? 0x100 : 0x120));
  const records = VANILLA.flatMap((item, n) => [...le16(0x0403 + n), ...le16(item)]);
  const items = withItems ? [...itemRomFixture()].map(([id, byte]) => ({ id, data: [byte] })) : [];
  return buildPack([{ id: 0x35f000, data: pointers }, { id: 0x350100, data: records }, ...items]);
};

const nextItems = (difficulty: ItemDifficulty, placement = {}, withItems = true): Map<string, number> => {
  const pack = syntheticPack(withItems);
  const plan = planChestEdits(pack, deriveChestChecks(pack), placement, { difficulty });
  const byWhy = new Map<string, number>();
  plan.edits.forEach((e) => {
    if (!byWhy.has(e.why)) byWhy.set(e.why, e.next);
  });
  return byWhy;
};

describe('planChestEdits tiers', { tags: ['critical'] }, () => {
  it('leaves non-key chests alone on normal', () => {
    expect([...nextItems('normal')]).toEqual([]);
  });

  it('moves chests one stat tier up on easy', () => {
    expect([...nextItems('easy')]).toEqual([['chest-005-0', 2], ['chest-005-1', 3]]);
  });

  it('moves chests one stat tier down on hard', () => {
    expect([...nextItems('hard')]).toEqual([['chest-005-1', 1], ['chest-005-2', 2]]);
  });

  it('changes nothing when the pack has no item tables', () => {
    expect([...nextItems('hard', {}, false)]).toEqual([]);
  });

  it('a placed item wins over the tier', () => {
    expect(nextItems('hard', { 'chest-005-0': 0x30 }).get('chest-005-0')).toBe(0x30);
  });
});
