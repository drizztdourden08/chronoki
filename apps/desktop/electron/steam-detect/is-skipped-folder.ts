/* @layer electron-main @kind logic */
import { SKIPPED_FOLDER_NAMES } from './steam-detect.constants';
import type { DirItem } from './steam-detect.type';

const isSkippedFolder = ({ name, isDirectory, isLink }: DirItem): boolean =>
  !isDirectory || isLink || name.startsWith('.') || SKIPPED_FOLDER_NAMES.includes(name.toLowerCase());

export { isSkippedFolder };
