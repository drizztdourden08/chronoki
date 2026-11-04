/* @layer renderer-components @kind hook */
import { useEffect } from 'react';
import { usePlatform, useSettings } from '@drizztdourden08/brock-react';
import type { CkFrameSize } from '@chronoki/game-core';
import type { AppSettings } from '@app/settings.type';
import { aspectLockArgs } from './aspect-lock-args';
import { useFullscreenState } from './useFullscreenState';
import { useViewport } from './useViewport';

const useAspectRatioLock = (active: boolean, frame: CkFrameSize): void => {
  const { window: win } = usePlatform();
  const { settings } = useSettings<AppSettings>();
  const { viewport } = useViewport();
  const isFullscreen = useFullscreenState(win);
  const { windowMode } = settings;
  const { width, height } = frame;

  useEffect(() => {
    const [ratio, extra] = active ? aspectLockArgs({ viewport, windowMode, isFullscreen, frame: { width, height } }) : [0, 0];
    win.setAspectRatioLock(ratio, extra);
    return () => win.setAspectRatioLock(0, 0);
  }, [win, active, viewport, windowMode, isFullscreen, width, height]);
};

export { useAspectRatioLock };
