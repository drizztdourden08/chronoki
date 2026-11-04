/* @layer renderer-lib @kind logic */
import { getAppLog } from '@drizztdourden08/brock-react';
import { pushEvent } from './push-event';
import type { CaptureSession } from './debug-capture.type';

const watchLogs = (session: CaptureSession): (() => void) =>
  getAppLog().subscribe((entry) => pushEvent(session, 'log', `[${entry.channel}] ${entry.level}: ${entry.message}`));

export { watchLogs };
