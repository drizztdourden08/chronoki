/* @layer renderer-components @kind hook */
import { useEffect, useRef, useState } from 'react';
import { usePlatform, useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import type { GameLaunch } from '@app/views/GameSession';
import type { StageWait } from '../GameLayer.type';
import { settleDelay } from './settle-delay';
import { useFullscreenState } from './useFullscreenState';

const useStageSettled = (launch: GameLaunch | null, planKey: string): boolean => {
  const { window: win } = usePlatform();
  const { settings } = useSettings<AppSettings>();
  const isFullscreen = useFullscreenState(win);
  const [settledId, setSettledId] = useState<number | null>(null);
  const wait = useRef<StageWait | null>(null);
  const launchId = launch?.id ?? null;
  const { startFullscreen } = settings;

  useEffect(() => {
    if (launchId === null) {
      wait.current = null;
      return;
    }
    if (wait.current?.id === launchId) return;
    const fullscreen = wait.current === null && startFullscreen;
    wait.current = { id: launchId, since: performance.now(), fullscreen };
    if (fullscreen) win.setFullscreen(true);
  }, [launchId, startFullscreen, win]);

  useEffect(() => {
    const current = wait.current;
    if (launchId === null || current?.id !== launchId || settledId === launchId) return;
    const delay = settleDelay({ elapsed: performance.now() - current.since, fullscreenPending: current.fullscreen && !isFullscreen });
    const timer = window.setTimeout(() => setSettledId(launchId), delay);
    return () => window.clearTimeout(timer);
  }, [launchId, planKey, isFullscreen, settledId]);

  return launchId !== null && settledId === launchId;
};

export { useStageSettled };
