/* @layer renderer-lib @kind logic */
import { destroyHapticBridge } from '@chronoki/input-mapping';
import { initHapticBridge } from './init-haptic-bridge';
import { startHapticLoop } from './start-haptic-loop';

const startHaptics = (): (() => void) => {
  initHapticBridge();
  const stopLoop = startHapticLoop();
  return () => {
    stopLoop();
    destroyHapticBridge();
  };
};

export { startHaptics };
