/* @layer bridge-wasm @kind logic */
import { INVENTORY_COUNTS, INVENTORY_IDS, INVENTORY_SLOTS } from '../game-info/wram-map.constants';
import { ITEM_ID_MAX, ITEM_STACK_MAX } from './cheats.constants';
import type { CheatWrite } from './cheat-write.type';

const SLOTS = Array.from({ length: INVENTORY_SLOTS }, (_, slot) => slot);

const slotOf = (heap: Uint8Array, ptr: number, id: number): number => {
  const same = SLOTS.find((slot) => heap[ptr + INVENTORY_IDS + slot] === id && heap[ptr + INVENTORY_COUNTS + slot] !== 0);
  if (same !== undefined) return same;
  return SLOTS.find((slot) => heap[ptr + INVENTORY_IDS + slot] === 0 || heap[ptr + INVENTORY_COUNTS + slot] === 0) ?? -1;
};

const giveItem = (heap: Uint8Array, ptr: number, write: CheatWrite, id: number, count: number): boolean => {
  if (!Number.isInteger(id) || id < 1 || id > ITEM_ID_MAX || !Number.isInteger(count) || count < 1) return false;
  const slot = slotOf(heap, ptr, id);
  if (slot < 0) return false;
  const held = heap[ptr + INVENTORY_IDS + slot] === id ? heap[ptr + INVENTORY_COUNTS + slot] : 0;
  const total = Math.min(held + count, ITEM_STACK_MAX);
  return write(INVENTORY_IDS + slot, Uint8Array.of(id)) && write(INVENTORY_COUNTS + slot, Uint8Array.of(total));
};

export { giveItem };
