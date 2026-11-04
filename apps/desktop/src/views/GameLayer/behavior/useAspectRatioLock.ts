/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { usePlatform, useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { aspectLockArgs } from './aspect-lock-args';
import { useFullscreenState } from './useFullscreenState';
import { useViewport } from './useViewport';

const useAspectRatioLock = (active: boolean, ratio: number): void => {
  const { window: win } = usePlatform();
  const { settings } = useSettings<AppSettings>();
  const { viewport } = useViewport();
  const isFullscreen = useFullscreenState(win);
  const { windowMode } = settings;

  useEffect(() => {
    const [lock, extra] = active ? aspectLockArgs({ viewport, windowMode, isFullscreen, ratio }) : [0, 0];
    win.setAspectRatioLock(lock, extra);
    return () => win.setAspectRatioLock(0, 0);
  }, [win, active, viewport, windowMode, isFullscreen, ratio]);
};

export { useAspectRatioLock };
