/* @layer renderer-appshell @kind logic */
import { chronokiCore } from '@app/game/lifecycle';
import { FRAME_WAIT_TIMEOUT_MS } from '../GameSession.constants';
import { presentedFrames } from './presented-frames';

const waitForExactFrame = (target: number): Promise<number> =>
  new Promise((resolve) => {
    const deadline = performance.now() + FRAME_WAIT_TIMEOUT_MS;
    const check = (): void => {
      const count = presentedFrames();
      if (count >= target || chronokiCore.state().status !== 'running' || performance.now() > deadline) resolve(count);
      else requestAnimationFrame(check);
    };
    check();
  });

export { waitForExactFrame };
