/* @layer shared-asset-extraction @kind logic */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ManifestFile } from '../recipes/manifest.type';

const readFolderTexts = async (dir: string, pattern: RegExp): Promise<ManifestFile[]> => {
  const names = (await readdir(dir)).filter((n) => pattern.test(n)).sort();
  return Promise.all(names.map(async (name) => ({ name, text: await readFile(join(dir, name), 'utf8') })));
};

export { readFolderTexts };
