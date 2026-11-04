/* @layer renderer-lib @kind logic */
import { pushEvent } from './push-event';
import type { CaptureSession } from './debug-capture.type';

const watchInput = (session: CaptureSession): (() => void) => {
  const onDown = (event: KeyboardEvent): void => {
    if (!event.repeat) pushEvent(session, 'input', `down ${event.code}`);
  };
  const onUp = (event: KeyboardEvent): void => pushEvent(session, 'input', `up ${event.code}`);
  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);
  return () => {
    window.removeEventListener('keydown', onDown);
    window.removeEventListener('keyup', onUp);
  };
};

export { watchInput };
