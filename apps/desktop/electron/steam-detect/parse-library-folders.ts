/* @layer electron-main @kind logic */
const PATH_LINE = /^\s*"path"\s+"((?:[^"\\]|\\.)*)"\s*$/gm;

const parseLibraryFolders = (vdf: string): string[] => {
  const paths: string[] = [];
  for (const match of vdf.matchAll(PATH_LINE)) {
    const raw = match[1];
    if (raw) paths.push(raw.replace(/\\(.)/g, '$1'));
  }
  return paths;
};

export { parseLibraryFolders };
