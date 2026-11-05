/* @layer electron-main @kind logic */
import { getUserDataPath } from '@drizztdourden08/brock-electron/main';
import { RECORDINGS_DIR } from './finalize-capture-session.constants';

// Same folder brock-tools' finalizeRecording writes to: <data>/recordings/<scope>/<key>, scope = profile id.
const captureSessionDir = (profileId: string, sessionKey: string): string =>
  getUserDataPath(RECORDINGS_DIR, profileId, sessionKey);

export { captureSessionDir };
