/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { padHexOrNull } from '../profile-edit/pad-hex-or-null';
import type { CaptureHandler, ControlsState, ListeningTarget } from './controls.type';

const useCapture = (ctrl: ControlsState) => {
  const [listeningFor, setListeningFor] = useState<ListeningTarget | null>(null);

  const handleCapture: CaptureHandler = useCallback((binding, _sourceDeviceKey, vendorId, productId) => {
    if (!listeningFor) return;
    setListeningFor(null);
    const vid = padHexOrNull(vendorId);
    const pid = padHexOrNull(productId);
    if (listeningFor.type === 'snes') ctrl.bindSnes(listeningFor.button, binding, vid, pid);
    else ctrl.bindFunction(listeningFor.action, binding, vid, pid);
  }, [listeningFor, ctrl]);

  const cancel = useCallback(() => setListeningFor(null), []);

  return { listeningFor, setListeningFor, handleCapture, cancel };
};

export { useCapture };
