/* @layer renderer-app @kind logic */
import type { CaptureSummary } from '@app/bug-report/debug-capture/debug-capture.type';

const recordingName = (session: CaptureSummary): string => new Date(session.startedAt).toLocaleString();

export { recordingName };
