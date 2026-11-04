/* @layer electron-main @kind logic */
import { archivePathOf } from './archive-path-of';
import type { ScanFs } from './steam-detect.type';

const findArchiveInRoot = async (root: string, fs: ScanFs): Promise<string | null> => {
  const candidate = archivePathOf(root);
  return (await fs.isFile(candidate)) ? candidate : null;
};

export { findArchiveInRoot };
