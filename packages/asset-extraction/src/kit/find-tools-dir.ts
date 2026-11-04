/* @layer shared-asset-extraction @kind logic */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { isDirectory } from './is-directory';
import { RECIPES_FOLDER, TOOLS_LOCATIONS } from './kit-paths.constants';

const candidatesOf = async (root: string): Promise<string[]> => {
  const subfolders = (await readdir(root, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => join(root, e.name));
  return [root, ...subfolders].flatMap((base) => TOOLS_LOCATIONS.map((loc) => join(base, loc)));
};

const findToolsDir = async (belthasarDir: string): Promise<string> => {
  for (const candidate of await candidatesOf(belthasarDir)) {
    if (await isDirectory(join(candidate, RECIPES_FOLDER))) return candidate;
  }
  throw new Error(`no Belthasar tools folder (with ${RECIPES_FOLDER}/) under ${belthasarDir}`);
};

export { findToolsDir };
