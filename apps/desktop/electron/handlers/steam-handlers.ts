/* @layer electron-main @kind logic */
import { handle } from '@drizztdourden08/brock-electron/main';
import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';
import { cancelDetect } from '../steam-detect/cancel-detect';
import { detectStatus } from '../steam-detect/detect-status';
import { pickArchive } from '../steam-detect/pick-archive';
import { readArchiveRange } from '../steam-detect/read-archive-range';
import { startDetect } from '../steam-detect/start-detect';

const steamHandlers: HandlerGroup = {
  id: 'steam',
  register: () => {
    handle('steam:detectStart', () => startDetect());
    handle('steam:detectCancel', () => cancelDetect());
    handle('steam:detectStatus', () => detectStatus());
    handle('steam:pick', () => pickArchive());
    handle('steam:readRange', (_event, path: string, offset: number, length: number) => readArchiveRange(path, offset, length));
  },
};

export { steamHandlers };
