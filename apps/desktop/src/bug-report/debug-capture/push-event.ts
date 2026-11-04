/* @layer renderer-lib @kind logic */
import { CAPTURE_MAX_EVENTS } from './debug-capture.constants';
import type { CaptureEventKind, CaptureSession } from './debug-capture.type';

const pushEvent = (session: CaptureSession, kind: CaptureEventKind, text: string): void => {
  if (session.events.length >= CAPTURE_MAX_EVENTS) return;
  session.events.push({ at: Date.now() - session.startedAt, kind, text });
};

export { pushEvent };
