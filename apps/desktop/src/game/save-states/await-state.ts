/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { EXPORT_STATE_STATUS, STATE_MAX_FRAMES, STATE_STATUS_FAILED, STATE_STATUS_OK } from './state-status.constants';
import { nextFrame } from './next-frame';
import type { StateOutcome } from './save-state.type';

const awaitState = async (calls: CoreCalls): Promise<StateOutcome> => {
  for (let frame = 0; frame <= STATE_MAX_FRAMES; frame += 1) {
    const status = calls.number(EXPORT_STATE_STATUS);
    if (status === STATE_STATUS_OK) return 'ok';
    if (status === STATE_STATUS_FAILED) return 'failed';
    if (frame < STATE_MAX_FRAMES) await nextFrame();
  }
  return 'timeout';
};

export { awaitState };
