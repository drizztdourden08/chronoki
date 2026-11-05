/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { deriveChestChecks } from '../checks/derive-chest-checks';
import { isKeyId } from '../world/treasure-tiers/tier-pool-of';
import { tierSlotOf } from '../world/treasure-tiers/tier-slot-of';
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

const VANILLA = [0x0a, 0x20, 0x60, 0xd6, 0xc0];

const syntheticPack = (): Uint8Array => {
  const pointers: number[] = [];
  for (let i = 0; i < 513; i += 1) pointers.push(...le16(i <= 5 ? 0x100 : 0x120));
  const records = VANILLA.flatMap((item, n) => [...le16(0x0403 + n), ...le16(item)]);
  return buildPack([{ id: 0x35f000, data: pointers }, { id: 0x350100, data: records }]);
};

const nextItems = (difficulty: 'easy' | 'normal' | 'hard', placement = {}): Map<string, number> => {
  const pack = syntheticPack();
  const plan = planChestEdits(pack, deriveChestChecks(pack), placement, difficulty);
  const byWhy = new Map<string, number>();
  plan.edits.forEach((e) => {
    if (!byWhy.has(e.why)) byWhy.set(e.why, e.next);
  });
  return byWhy;
};

describe('planChestEdits tiers', { tags: ['critical'] }, () => {
  it('leaves non-key chests alone on normal', () => {
    const pack = syntheticPack();
    expect(planChestEdits(pack, deriveChestChecks(pack), {}, 'normal').edits).toEqual([]);
  });

  it('moves chests one tier up on easy and keeps the item group', () => {
    const items = nextItems('easy');
    const first = items.get('chest-005-0');
    expect(first).toBeDefined();
    expect(tierSlotOf(first ?? 0)?.tier).toBe(1);
    expect(tierSlotOf(first ?? 0)?.group).toBe(tierSlotOf(0x0a)?.group);
  });

  it('moves chests one tier down on hard and never to a key item', () => {
    const items = nextItems('hard');
    const second = items.get('chest-005-1');
    expect(tierSlotOf(second ?? 0)?.tier).toBe(0);
    items.forEach((item) => expect(isKeyId(item)).toBe(false));
  });

  it('never rewrites a vanilla key-item chest by tier', () => {
    expect(nextItems('hard').has('chest-005-3')).toBe(false);
  });

  it('is deterministic per chest', () => {
    expect(nextItems('easy')).toEqual(nextItems('easy'));
  });

  it('a placed item wins over the tier', () => {
    expect(nextItems('hard', { 'chest-005-0': 0x30 }).get('chest-005-0')).toBe(0x30);
  });
});
