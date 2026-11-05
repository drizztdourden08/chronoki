/* @layer renderer-lib @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import { setVibrateFunction, hapticState, startDebugLog } from '@chronoki/input-mapping';
import { dispatchVibration } from './dispatch-vibration';

const initHapticBridge = (): void => {
  if (hapticState.initialized) return;
  hapticState.initialized = true;

  if (hostApi()?.isDev) startDebugLog();
  setVibrateFunction(dispatchVibration);
};

export { initHapticBridge };
