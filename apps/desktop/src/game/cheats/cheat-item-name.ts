/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_ITEM_NAME } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { cachedName } from '../game-info/name-cache';

const cheatItemName = (id: number): string => {
  const calls = chronokiCore.calls();
  return calls ? cachedName(calls, CK_EXPORT_ITEM_NAME, id) : '';
};

export { cheatItemName };
