/* @layer electron-main @kind logic */
import { join } from 'path';
import { getUserDataPath } from '@drizztdourden08/brock-electron/main';
import { RECORDINGS_DIR } from '../finalize-capture-session';

const captureManifestPath = (profileId: string): string =>
  join(getUserDataPath(RECORDINGS_DIR, profileId), 'manifest.json');

export { captureManifestPath };
