/* @layer electron-main @kind logic */
import { stat } from 'node:fs/promises';
import { dialog } from 'electron';
import type { SteamPick } from '@app/ipc/steam-detect.type';
import { detectSession } from './detect-session';
import { startFolderOf } from './start-folder-of';

const pickArchive = async (): Promise<SteamPick | null> => {
  const defaultPath = await startFolderOf();
  const picked = await dialog.showOpenDialog({ title: 'Choose resources.bin', defaultPath, properties: ['openFile'], filters: [{ name: 'resources.bin', extensions: ['bin'] }] });
  const path = picked.filePaths[0];
  if (picked.canceled || !path) return null;
  detectSession.allowed = path;
  return { path, size: (await stat(path)).size };
};

export { pickArchive };
