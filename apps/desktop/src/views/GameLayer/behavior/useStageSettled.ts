/* @layer renderer-components @kind hook */
import { useEffect, useRef, useState } from 'react';
import { usePlatform, useSettings, useSettingsStore } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import type { GameLaunch } from '@app/views/GameSession';
import type { StageWait } from '../GameLayer.type';
import { fullscreenPending } from './fullscreen-pending';
import { settleDelay } from './settle-delay';
import { useFullscreenState } from './useFullscreenState';

const useStageSettled = (launch: GameLaunch | null, planKey: string): boolean => {
  const { window: win } = usePlatform();
  const { settings, hydrated } = useSettings<AppSettings>();
  const store = useSettingsStore<AppSettings>();
  const settingsProfile = store((state) => state.profileId);
  const isFullscreen = useFullscreenState(win);
  const [settledId, setSettledId] = useState<number | null>(null);
  const wait = useRef<StageWait | null>(null);
  const launchId = launch?.id ?? null;
  const ready = hydrated && launch !== null && settingsProfile === launch.profileId;
  const wantsFullscreen = settings.startFullscreen || settings.windowMode === 'fullscreen';

  useEffect(() => {
    if (launchId === null) {
      wait.current = null;
      return;
    }
    if (wait.current?.id !== launchId) {
      wait.current = { id: launchId, since: performance.now(), fullscreen: wait.current === null ? null : false };
    }
    if (wait.current.fullscreen !== null || !ready) return;
    wait.current = { ...wait.current, fullscreen: wantsFullscreen };
    if (wantsFullscreen) win.setFullscreen(true);
  }, [launchId, ready, wantsFullscreen, win]);

  useEffect(() => {
    const current = wait.current;
    if (launchId === null || current?.id !== launchId || settledId === launchId) return;
    const delay = settleDelay({ elapsed: performance.now() - current.since, fullscreenPending: fullscreenPending(current, isFullscreen) });
    const timer = window.setTimeout(() => setSettledId(launchId), delay);
    return () => window.clearTimeout(timer);
  }, [launchId, planKey, isFullscreen, settledId, ready]);

  return launchId !== null && settledId === launchId;
};

export { useStageSettled };
