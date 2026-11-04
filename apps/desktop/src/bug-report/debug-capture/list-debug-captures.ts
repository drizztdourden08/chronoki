/* @layer renderer-lib @kind logic */
import { platformFiles } from '@app/storage/platform-files';
import { captureDirOf } from './capture-path';
import { readCaptureSession } from './read-capture-session';
import type { CaptureSession, CaptureSummary } from './debug-capture.type';

const KEY_OF_FILE = /\.json$/;

const summaryOf = (session: CaptureSession): CaptureSummary => ({
  sessionKey: session.sessionKey,
  profileId: session.profileId,
  startedAt: session.startedAt,
  endedAt: session.endedAt,
  eventCount: session.events.length,
});

const listDebugCaptures = async (profileId: string): Promise<CaptureSummary[]> => {
  const names = await platformFiles().list(captureDirOf(profileId)).catch(() => []);
  const sessions = await Promise.all(
    names.filter((name) => KEY_OF_FILE.test(name)).map((name) => readCaptureSession(profileId, name.replace(KEY_OF_FILE, ''))),
  );
  return sessions.flatMap((session) => (session ? [summaryOf(session)] : [])).sort((a, b) => b.startedAt - a.startedAt);
};

export { listDebugCaptures };
