/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

const useWindowModeReset = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const { windowMode } = settings;
  useEffect(() => {
    if (windowMode === 'fullscreen') patch({ windowMode: 'windowed', startFullscreen: true });
    else if (windowMode !== 'windowed') patch({ windowMode: 'windowed' });
  }, [windowMode, patch]);
};

export { useWindowModeReset };
