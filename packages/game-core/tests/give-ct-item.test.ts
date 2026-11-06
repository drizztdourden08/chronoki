/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ITEM_ID_MAX, ITEM_STACK_MAX } from '../src/cheats';
import { GOLD, GOLD_MAX, INVENTORY_COUNTS, INVENTORY_IDS } from '../src/game-info/wram-map.constants';
import { giveCtItem } from '../src/randomizer/online';
import type { CtGiveAction, CtGiveItem, CtGiveTarget } from '../src/randomizer/online';
import { JETS_ITEM_ID } from '../src/randomizer/session/jets-wings.constants';

const PTR = 0x100;
const HEAP_SIZE = PTR + 0x20000;
const GOLD_BYTES = 3;
const BYTE = 256;

const targetOf = (accept = true): CtGiveTarget => {
  const heap = new Uint8Array(HEAP_SIZE);
  const write = (offset: number, bytes: Uint8Array): boolean => {
    if (!accept) return false;
    heap.set(bytes, PTR + offset);
    return true;
  };
  return { heap, ptr: PTR, write };
};

const actionOf = (item: CtGiveItem): CtGiveAction => ({ kind: 'give', item });

const goldIn = ({ heap }: CtGiveTarget): number =>
  Array.from({ length: GOLD_BYTES }, (_, i) => (heap[PTR + GOLD + i] ?? 0) * BYTE ** i).reduce((a, b) => a + b, 0);

const idAt = ({ heap }: CtGiveTarget, slot: number): number | undefined => heap[PTR + INVENTORY_IDS + slot];
const countAt = ({ heap }: CtGiveTarget, slot: number): number | undefined => heap[PTR + INVENTORY_COUNTS + slot];

describe('giving a ChronoKi item to the running game', { tags: ['critical'] }, () => {
  it('puts an inventory item in the first free slot and stacks the next copy', () => {
    const target = targetOf();
    expect(giveCtItem(target, actionOf({ type: 'inventory', romId: 0x10, count: 1 }))).toBe('settled');
    expect(giveCtItem(target, actionOf({ type: 'inventory', romId: 0x10, count: 2 }))).toBe('settled');
    expect([idAt(target, 0), countAt(target, 0)]).toEqual([0x10, 3]);
    expect(idAt(target, 1)).toBe(0);
  });

  it('caps a stack at the game maximum', () => {
    const target = targetOf();
    giveCtItem(target, actionOf({ type: 'inventory', romId: 0x10, count: ITEM_STACK_MAX }));
    giveCtItem(target, actionOf({ type: 'inventory', romId: 0x10, count: 5 }));
    expect(countAt(target, 0)).toBe(ITEM_STACK_MAX);
  });

  it('adds gold to what is held, clamped to the wallet maximum', () => {
    const target = targetOf();
    expect(giveCtItem(target, actionOf({ type: 'gold', amount: 500 }))).toBe('settled');
    expect(giveCtItem(target, actionOf({ type: 'gold', amount: 250 }))).toBe('settled');
    expect(goldIn(target)).toBe(750);
    expect(giveCtItem(target, actionOf({ type: 'gold', amount: GOLD_MAX }))).toBe('settled');
    expect(goldIn(target)).toBe(GOLD_MAX);
  });

  it('gives a tab as the one inventory item its stat slot names', () => {
    const target = targetOf();
    const stat = { kind: 'power', id: 0x41, base: 0, work: 0, baseCap: 0 } as unknown as Extract<CtGiveItem, { type: 'tab' }>['stat'];
    expect(giveCtItem(target, actionOf({ type: 'tab', stat }))).toBe('settled');
    expect([idAt(target, 0), countAt(target, 0)]).toEqual([0x41, 1]);
  });

  it('gives the jets of time as its own inventory item', () => {
    const target = targetOf();
    expect(giveCtItem(target, actionOf({ type: 'jets' }))).toBe('settled');
    expect([idAt(target, 0), countAt(target, 0)]).toEqual([JETS_ITEM_ID, 1]);
  });

  it('refuses a bad id, count or amount and writes nothing', () => {
    const target = targetOf();
    const refused: CtGiveItem[] = [
      { type: 'inventory', romId: 0, count: 1 },
      { type: 'inventory', romId: ITEM_ID_MAX + 1, count: 1 },
      { type: 'inventory', romId: 0x10, count: 0 },
      { type: 'inventory', romId: 0x10, count: 1.5 },
      { type: 'gold', amount: 0 },
      { type: 'gold', amount: -3 },
      { type: 'gold', amount: 2.5 },
    ];
    expect(refused.map((item) => giveCtItem(target, actionOf(item)))).toEqual(refused.map(() => 'refused'));
    expect(target.heap.every((byte) => byte === 0)).toBe(true);
  });

  it('asks for a retry when the game memory will not take the write', () => {
    const target = targetOf(false);
    expect(giveCtItem(target, actionOf({ type: 'inventory', romId: 0x10, count: 1 }))).toBe('retry');
    expect(giveCtItem(target, actionOf({ type: 'gold', amount: 10 }))).toBe('retry');
    expect(giveCtItem(target, actionOf({ type: 'jets' }))).toBe('retry');
  });
});
