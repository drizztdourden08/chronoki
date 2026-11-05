/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_ITEM_NAME, createCtWramWriter, giveItem, readGameInfo, refillCharacter, setGold } from '@chronoki/game-core';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { cachedName } from '../game-info/name-cache';
import { chronokiMemoryOptions } from '../randomizer/chronoki-memory-options';
import { chronokiRawMemoryBridge } from '../randomizer/chronoki-raw-memory-bridge';

const write = createCtWramWriter(chronokiMemoryOptions, chronokiRawMemoryBridge);

const withMemory = <T>(fallback: T, use: (heap: Uint8Array, ptr: number) => T): T => {
  const heap = chronokiMemoryOptions.heap();
  const ptr = chronokiMemoryOptions.wramPtr();
  if (!heap || !chronokiMemoryOptions.isLive() || ptr <= 0) return fallback;
  return use(heap, ptr);
};

const readCheatSnapshot = (): GameInfoSnapshot | null => withMemory(null, (heap, ptr) => readGameInfo(heap, ptr));

const cheatGiveItem = (id: number, count: number): boolean =>
  withMemory(false, (heap, ptr) => giveItem(heap, ptr, write, id, count));

const cheatSetGold = (gold: number): boolean => withMemory(false, () => setGold(write, gold));

const cheatRefill = (ids: readonly number[]): boolean =>
  withMemory(false, (heap, ptr) => ids.every((id) => refillCharacter(heap, ptr, write, id)));

const cheatItemName = (id: number): string => {
  const calls = chronokiCore.calls();
  return calls ? cachedName(calls, CK_EXPORT_ITEM_NAME, id) : '';
};

export { cheatGiveItem, cheatItemName, cheatRefill, cheatSetGold, readCheatSnapshot };
