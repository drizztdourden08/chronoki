/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_ERA_NAME, CK_EXPORT_WRAM_PTR, readGameInfo } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { readHeapText } from '../state-buffers';
import { LIVE_STATUSES } from './game-info.constants';
import type { ChronokiInfoSnapshot } from './game-info.type';

const readChronokiInfo = (): ChronokiInfoSnapshot | null => {
  const calls = chronokiCore.calls();
  if (!calls || !LIVE_STATUSES.includes(chronokiCore.state().status) || !calls.has(CK_EXPORT_WRAM_PTR)) return null;
  const snapshot = readGameInfo(calls.heap(), calls.number(CK_EXPORT_WRAM_PTR));
  if (!snapshot) return null;
  const namePtr = calls.has(CK_EXPORT_ERA_NAME) ? calls.number(CK_EXPORT_ERA_NAME, snapshot.location.id) : 0;
  return { ...snapshot, eraName: namePtr ? readHeapText(calls, namePtr) : null };
};

export { readChronokiInfo };
