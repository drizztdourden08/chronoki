/* @layer renderer-app @kind hook */
import { useContext } from 'react';
import { effectiveHz } from '@drizztdourden08/brock-display';
import { useRefreshRate } from '@drizztdourden08/brock-display/renderer';
import { useSettings } from '@drizztdourden08/brock-react';
import { GameSessionContext } from '@app/views/GameSession/GameSession.context';
import type { AppSettings } from '@app/settings.type';
import { useFpsReadout } from './useFpsReadout';

const useFpsAndRefreshRate = (): { showFps: boolean; fps: number; refreshHz: number | null } => {
  const { settings } = useSettings<AppSettings>();
  const session = useContext(GameSessionContext);
  const showFps = settings.showFps;
  const fps = useFpsReadout(showFps && (session?.running ?? false));
  return { showFps, fps, refreshHz: effectiveHz(useRefreshRate()) };
};

export { useFpsAndRefreshRate };
