/* @layer electron-main @kind logic */
import { handle } from '@drizztdourden08/brock-electron/main';
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import type { EventLogEntry, TestArgs } from '@app/ipc';
import { SCREENSHOT_FLAG } from '../automation/automation-flags.constants';
import { chronokiAutomationFlags } from '../automation/chronoki-automation-flags';
import { AUTO_STATE_FLAG } from './test-handlers.constants';
import { appendEventLog } from './append-event-log';

const autoStateOf = (raw: string | null): number | string | null => {
  if (raw === null) return null;
  return /^\d+$/.test(raw) ? parseInt(raw, 10) : raw;
};

const testArgs = (): TestArgs => ({
  autoState: autoStateOf(chronokiAutomationFlags.flagValue(AUTO_STATE_FLAG)),
  screenshot: chronokiAutomationFlags.flagValue(SCREENSHOT_FLAG),
});

const testHandlers: HandlerGroup = {
  id: 'test',
  register: () => {
    handle('test:getArgs', testArgs);
    handle('eventLog:append', (_event, entry: EventLogEntry) => appendEventLog(entry));
  },
};

export { testHandlers };
