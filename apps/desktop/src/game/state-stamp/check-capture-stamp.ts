/* @layer bridge-wasm @kind logic */
import { decodeCkStateV2 } from '@chronoki/game-core';
import type { CkSettings } from '@chronoki/game-core';
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import { appLog } from '@app/log/app-log';
import { readCoreStamp } from './read-core-stamp';
import { stateStampState } from './state-stamp-state';

const checkCaptureStamp = (core: GameCore<CkSettings>, container: Uint8Array): boolean => {
  const produced = decodeCkStateV2(container)?.stamp;
  const current = readCoreStamp(core);
  if (produced && current && produced.schema === current.schema) return true;
  if (!stateStampState.driftReported) {
    stateStampState.driftReported = true;
    appLog.error(
      `[SaveState] Stamp drift: the core wrote a state stamped ${produced?.schema ?? 'nothing'}, `
      + `but reports ${current?.schema ?? 'no stamp'}. The core and the container reader are out of step; rebuild the core.`,
    );
  }
  return false;
};

export { checkCaptureStamp };
