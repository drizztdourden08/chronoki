/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import type { CoreStatus } from '@drizztdourden08/brock-port-kit/renderer';
import { setGamePaused } from '@app/game/lifecycle';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { peekInputManager } from '@app/input/input-manager/peek-input-manager';
import { CONTROLLER_PRESENCE_DELAY_MS } from '../GameSession.constants';
import { pauseSyncPlan } from './pause-sync-plan';

const useSyncCorePause = (running: boolean, status: CoreStatus): void => {
  useEffect(() => {
    if (!running) return undefined;
    return getInputManager().onPauseChange((paused) => setGamePaused(paused));
  }, [running]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => getInputManager().checkControllerPresence(), CONTROLLER_PRESENCE_DELAY_MS);
    return () => clearTimeout(id);
  }, [running]);

  useEffect(() => {
    const manager = peekInputManager();
    const plan = pauseSyncPlan({ running, inputPaused: manager?.isPaused() ?? false, status });
    if (plan.releaseInput) manager?.resume();
    if (plan.corePaused !== null) setGamePaused(plan.corePaused);
  }, [running, status]);
};

export { useSyncCorePause };
