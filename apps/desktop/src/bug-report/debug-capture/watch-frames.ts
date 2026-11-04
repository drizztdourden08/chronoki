/* @layer renderer-lib @kind logic */
import { FRAME_WINDOW_MS, SLOW_FRAME_MS } from './debug-capture.constants';
import { pushEvent } from './push-event';
import type { CaptureSession } from './debug-capture.type';

const watchFrames = (session: CaptureSession): (() => void) => {
  let handle = 0;
  let last = performance.now();
  let windowStart = last;
  let frames = 0;
  let slowest = 0;

  const tick = (now: number): void => {
    frames += 1;
    slowest = Math.max(slowest, now - last);
    last = now;
    if (now - windowStart >= FRAME_WINDOW_MS) {
      const flag = slowest > SLOW_FRAME_MS ? ' slow' : '';
      pushEvent(session, 'frame', `${frames} frames, slowest ${slowest.toFixed(1)} ms${flag}`);
      windowStart = now;
      frames = 0;
      slowest = 0;
    }
    handle = requestAnimationFrame(tick);
  };

  handle = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(handle);
};

export { watchFrames };
