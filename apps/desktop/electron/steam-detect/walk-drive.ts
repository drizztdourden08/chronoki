/* @layer electron-main @kind logic */
import { win32 } from 'node:path';
import { findArchiveInRoot } from './find-archive-in-root';
import { isSkippedFolder } from './is-skipped-folder';
import { isSteamRoot } from './is-steam-root';
import type { ScanControl, ScanFs } from './steam-detect.type';

const isStopped = (control: ScanControl): boolean => control.cancelled || control.visits >= control.limit;

const walkDrive = async (drive: string, fs: ScanFs, control: ScanControl): Promise<string | null> => {
  const queue = [drive];
  for (let dir = queue.shift(); dir !== undefined && !isStopped(control); dir = queue.shift()) {
    control.visits += 1;
    const items = await fs.readDir(dir).catch(() => []);
    if (isSteamRoot(win32.basename(dir), items)) {
      const found = await findArchiveInRoot(dir, fs);
      if (found) return found;
      continue;
    }
    for (const item of items) if (!isSkippedFolder(item)) queue.push(win32.join(dir, item.name));
  }
  return null;
};

export { walkDrive };
