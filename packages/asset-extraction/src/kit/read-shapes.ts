/* @layer shared-asset-extraction @kind logic */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const readShapes = async (root: string, rel = ''): Promise<Record<string, string>> => {
  const shapes: Record<string, string> = {};
  const entries = (await readdir(join(root, rel), { withFileTypes: true })).sort((a, b) => (a.name < b.name ? -1 : 1));
  for (const entry of entries) {
    const path = rel === '' ? entry.name : `${rel}/${entry.name}`;
    if (entry.isDirectory()) Object.assign(shapes, await readShapes(root, path));
    else shapes[path] = await readFile(join(root, path), 'utf8');
  }
  return shapes;
};

export { readShapes };
