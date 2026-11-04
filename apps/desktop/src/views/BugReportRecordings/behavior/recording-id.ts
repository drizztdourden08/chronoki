/* @layer renderer-app @kind logic */
import type { CaptureSummary } from '@app/bug-report/debug-capture/debug-capture.type';

const recordingId = (session: CaptureSummary): string => session.sessionKey;

export { recordingId };
