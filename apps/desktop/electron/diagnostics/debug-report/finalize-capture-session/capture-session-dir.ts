/* @layer electron-main @kind logic */
import { getUserDataPath } from '@drizztdourden08/brock-electron/main';
import { RECORDINGS_DIR } from './finalize-capture-session.constants';

const captureSessionDir = (profileId: string, sessionKey: string): string =>
  getUserDataPath(RECORDINGS_DIR, profileId, sessionKey);

export { captureSessionDir };
