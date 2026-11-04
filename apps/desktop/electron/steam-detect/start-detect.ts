/* @layer electron-main @kind logic */
import { stat } from 'node:fs/promises';
import { detectSession } from './detect-session';
import { detectSteamArchive } from './detect-steam-archive';
import { listDrives } from './list-drives';
import { nodeScanFs } from './node-scan-fs';
import { registrySteamRoots } from './registry-steam-roots';
import { MAX_FOLDER_VISITS } from './steam-detect.constants';

const runDetect = async (): Promise<void> => {
  const control = detectSession.control;
  const found = await detectSteamArchive(await registrySteamRoots(), listDrives(), nodeScanFs, control);
  if (control.cancelled) {
    detectSession.state = 'cancelled';
  } else if (found) {
    detectSession.path = found;
    detectSession.size = (await stat(found)).size;
    detectSession.allowed = found;
    detectSession.state = 'found';
  } else {
    detectSession.state = 'notFound';
  }
};

const startDetect = (): void => {
  if (detectSession.state === 'scanning') return;
  detectSession.control = { visits: 0, cancelled: false, limit: MAX_FOLDER_VISITS };
  detectSession.state = 'scanning';
  delete detectSession.path;
  delete detectSession.size;
  void runDetect().catch(() => {
    detectSession.state = 'notFound';
  });
};

export { startDetect };
