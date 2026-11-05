/* @layer bridge-wasm @kind logic */
import { GOLD, GOLD_MAX } from '../game-info/wram-map.constants';
import { BYTE_RADIX, GOLD_BYTE_COUNT } from './cheats.constants';
import type { CheatWrite } from './cheat-write.type';

const setGold = (write: CheatWrite, gold: number): boolean => {
  const clamped = Math.min(Math.max(Math.trunc(gold), 0), GOLD_MAX);
  const bytes = Uint8Array.from({ length: GOLD_BYTE_COUNT }, (_, i) => Math.floor(clamped / BYTE_RADIX ** i) % BYTE_RADIX);
  return write(GOLD, bytes);
};

export { setGold };
