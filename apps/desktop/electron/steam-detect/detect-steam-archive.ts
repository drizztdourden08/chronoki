/* @layer electron-main @kind logic */
import { findArchiveInRoot } from './find-archive-in-root';
import { knownSteamRoots } from './known-steam-roots';
import type { ScanControl, ScanFs } from './steam-detect.type';
import { walkDrive } from './walk-drive';

const checkRoots = async (roots: readonly string[], fs: ScanFs): Promise<string | null> => {
  for (const root of roots) {
    const found = await findArchiveInRoot(root, fs);
    if (found) return found;
  }
  return null;
};

const detectSteamArchive = async (registryRoots: readonly string[], drives: readonly string[], fs: ScanFs, control: ScanControl): Promise<string | null> => {
  const known = await checkRoots(await knownSteamRoots(registryRoots, fs), fs);
  if (known) return known;
  for (const drive of drives) {
    const found = await walkDrive(drive, fs, control);
    if (found) return found;
    if (control.cancelled || control.visits >= control.limit) break;
  }
  return null;
};

export { detectSteamArchive };
