/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_ERA_NAME, CK_EXPORT_WRAM_PTR, readGameInfo } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { LIVE_STATUSES } from './game-info.constants';
import type { ChronokiInfoSnapshot } from './game-info.type';
import { cachedName } from './name-cache';
import { readItemNames } from './read-item-names';
import { readTechNames } from './read-tech-names';

const readChronokiInfo = (): ChronokiInfoSnapshot | null => {
  const calls = chronokiCore.calls();
  if (!calls || !LIVE_STATUSES.includes(chronokiCore.state().status) || !calls.has(CK_EXPORT_WRAM_PTR)) return null;
  const snapshot = readGameInfo(calls.heap(), calls.number(CK_EXPORT_WRAM_PTR));
  if (!snapshot) return null;
  return {
    ...snapshot,
    eraName: cachedName(calls, CK_EXPORT_ERA_NAME, snapshot.location.id) || null,
    itemNames: readItemNames(calls, snapshot),
    techNames: readTechNames(calls, snapshot),
  };
};

export { readChronokiInfo };
