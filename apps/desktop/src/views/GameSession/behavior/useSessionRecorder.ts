/* @layer renderer-appshell @kind hook */
import { useEffect, useRef } from 'react';
import { appLog } from '@app/log/app-log';
import { useGateMode } from '@app/settings-controls/useGateMode';
import { saveSession } from '@app/storage/profile-data-store';
import { buildSession } from './build-session';

const useSessionRecorder = (profileId: string | null, running: boolean): void => {
  const mode = useGateMode();
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    if (!running || !profileId) return undefined;
    const startedAt = Date.now();
    const startMode = modeRef.current;
    return () => {
      saveSession(profileId, buildSession(profileId, startedAt, startMode)).catch(() => appLog.warn('[session] could not record play session'));
    };
  }, [running, profileId]);
};

export { useSessionRecorder };
