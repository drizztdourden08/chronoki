/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from '../pipeline/work-store.type';
import { readText } from '../pipeline/work-files';
import { keyPath } from './key-path';
import { statePath } from './recipe-store';

const readCached = async (work: WorkStore, name: string, key: string): Promise<Uint8Array | null> => {
  const stored = await readText(work, keyPath(name));
  return stored === key ? work.readBytes(statePath(name)) : null;
};

export { readCached };
