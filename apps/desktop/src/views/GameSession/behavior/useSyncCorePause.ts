/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { setGamePaused } from '@app/game/lifecycle';
import { getInputManager } from '@app/input/input-manager/get-input-manager';

const useSyncCorePause = (running: boolean): void => {
  useEffect(() => {
    if (!running) return undefined;
    return getInputManager().onPauseChange((paused) => setGamePaused(paused));
  }, [running]);
};

export { useSyncCorePause };
