/* @layer renderer-appshell @kind logic */
import { chronokiCore } from '@app/game/lifecycle';
import { FRAME_WAIT_TIMEOUT_MS } from '../GameSession.constants';
import { presentedFrames } from './presented-frames';

const waitForFrames = (target: number): Promise<'reached' | 'timeout' | 'stopped'> =>
  new Promise((resolve) => {
    const deadline = performance.now() + FRAME_WAIT_TIMEOUT_MS;
    const check = (): void => {
      if (chronokiCore.state().status === 'error' || chronokiCore.state().status === 'idle') resolve('stopped');
      else if (presentedFrames() >= target) resolve('reached');
      else if (performance.now() > deadline) resolve('timeout');
      else setTimeout(check, 50);
    };
    check();
  });

export { waitForFrames };
