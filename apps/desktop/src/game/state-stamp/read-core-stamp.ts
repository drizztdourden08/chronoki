/* @layer bridge-wasm @kind logic */
import { readCkStamp } from '@chronoki/game-core';
import type { CkSettings, CkStamp } from '@chronoki/game-core';
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import { EXPORT_STATE_STAMP, readHeapText } from '../state-buffers';

const readCoreStamp = (core: GameCore<CkSettings>): CkStamp | null => {
  const calls = core.calls();
  if (!calls?.has(EXPORT_STATE_STAMP)) return null;
  const ptr = calls.number(EXPORT_STATE_STAMP);
  return ptr ? readCkStamp(readHeapText(calls, ptr)) : null;
};

export { readCoreStamp };
