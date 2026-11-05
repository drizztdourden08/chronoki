/* @layer bridge-wasm @kind logic */
import { BYTE_RADIX, GOLD_BYTE_COUNT, setGold } from '../../cheats';
import { GOLD, GOLD_MAX } from '../../game-info/wram-map.constants';
import type { CtGiveResult, CtGiveTarget } from './give-ct-item.type';

const heldGold = (heap: Uint8Array, ptr: number): number =>
  Array.from({ length: GOLD_BYTE_COUNT }, (_, i) => (heap[ptr + GOLD + i] ?? 0) * BYTE_RADIX ** i).reduce((a, b) => a + b, 0);

const giveCtGold = ({ heap, ptr, write }: CtGiveTarget, amount: number): CtGiveResult => {
  if (!Number.isInteger(amount) || amount < 1) return 'refused';
  const total = Math.min(heldGold(heap, ptr) + amount, GOLD_MAX);
  return setGold(write, total) ? 'settled' : 'retry';
};

export { giveCtGold };
