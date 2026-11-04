/* @layer bridge-wasm @kind logic */
import { appLog } from '@app/log/app-log';
import { saveSession } from '@app/storage/profile-data-store';
import { buildSession } from '@app/views/GameSession/behavior/build-session';
import { sessionTrackerState } from './session-tracker-state';
import { sessionsListeners } from './sessions-listeners';

const endSession = async (): Promise<void> => {
  const open = sessionTrackerState.open;
  if (!open) return;
  sessionTrackerState.open = null;
  try {
    await saveSession(open.profileId, buildSession(open.profileId, open.startedAt, open.mode));
  } catch {
    appLog.warn('[session] could not record play session');
  }
  sessionsListeners.forEach((listener) => listener());
};

export { endSession };
