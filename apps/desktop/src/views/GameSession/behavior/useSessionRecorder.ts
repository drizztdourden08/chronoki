/* @layer renderer-appshell @kind hook */
import { useEffect, useRef } from 'react';
import { endSession, startSession } from '@app/game/session-tracker';
import { useGateMode } from '@app/settings-controls/useGateMode';

const useSessionRecorder = (profileId: string | null, running: boolean): void => {
  const mode = useGateMode();
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    if (!running || !profileId) return undefined;
    startSession(profileId, modeRef.current);
    return () => { void endSession(); };
  }, [running, profileId]);
};

export { useSessionRecorder };
