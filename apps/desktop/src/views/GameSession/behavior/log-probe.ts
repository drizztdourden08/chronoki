/* @layer renderer-appshell @kind logic */
import { requireHostApi } from '@drizztdourden08/brock-react';
import type { EventLogEntry } from '@app/ipc';

const logProbe = async (entry: EventLogEntry): Promise<void> => {
  const result = await requireHostApi().appendEventLog(entry);
  if (!result.success) console.warn(`[probe] event log: ${result.error ?? 'failed'}`);
};

export { logProbe };
