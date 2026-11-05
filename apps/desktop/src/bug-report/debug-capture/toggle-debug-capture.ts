/* @layer renderer-lib @kind logic */
import { activeGameHolder } from '@app/game/lifecycle';
import { captureAllowed } from './capture-allowed.state';
import { useDebugCaptureStore } from './useDebugCaptureStore';

const toggleDebugCapture = (): void => {
  const store = useDebugCaptureStore.getState();
  if (store.isCapturing) {
    store.stop();
    return;
  }
  const profileId = activeGameHolder.current?.profileId;
  if (profileId && captureAllowed.current) store.start(profileId);
};

export { toggleDebugCapture };
