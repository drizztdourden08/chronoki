/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { SteamDetectStatus } from '@app/ipc';
import { steamDetectApi } from './steam-detect-api';

const POLL_MS = 500;

const IDLE: SteamDetectStatus = { state: 'idle', visited: 0 };

const useSteamDetect = (enabled: boolean) => {
  const [status, setStatus] = useState<SteamDetectStatus>(IDLE);
  const available = steamDetectApi() !== null;

  const scan = useCallback(async () => {
    const api = steamDetectApi();
    if (!api) return;
    await api.steamDetectStart();
    setStatus({ state: 'scanning', visited: 0 });
  }, []);

  const cancel = useCallback(async () => {
    await steamDetectApi()?.steamDetectCancel();
  }, []);

  useEffect(() => {
    if (enabled) void scan();
  }, [enabled, scan]);

  useEffect(() => {
    if (status.state !== 'scanning') return undefined;
    const timer = setInterval(() => {
      void steamDetectApi()?.steamDetectStatus().then(setStatus);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [status.state]);

  return { status, available, scan, cancel };
};

export { useSteamDetect };
