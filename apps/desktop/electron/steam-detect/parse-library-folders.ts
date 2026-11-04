/* @layer electron-main @kind logic */
import { PATH_LINE } from './parse-library-folders.constants';

const parseLibraryFolders = (vdf: string): string[] => {
  const paths: string[] = [];
  for (const match of vdf.matchAll(PATH_LINE)) {
    const raw = match[1];
    if (raw) paths.push(raw.replace(/\\(.)/g, '$1'));
  }
  return paths;
};

export { parseLibraryFolders };
