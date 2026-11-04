/* @layer renderer-appshell @kind logic */
import { requireAppApi } from '@app/ipc/require-app-api';
import { appLog } from '@app/log/app-log';
import type { EventLogEntry } from '@app/ipc';

const logProbe = async (entry: EventLogEntry): Promise<void> => {
  const result = await requireAppApi().appendEventLog(entry);
  if (!result.success) appLog.warn(`[probe] event log: ${result.error ?? 'failed'}`);
};

export { logProbe };
