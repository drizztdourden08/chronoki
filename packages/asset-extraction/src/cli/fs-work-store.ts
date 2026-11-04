/* @layer shared-asset-extraction @kind logic */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { WorkStore } from '../pipeline/work-store.type';

const isMissing = (e: unknown): boolean => (e as NodeJS.ErrnoException).code === 'ENOENT';

/** A WorkStore over a folder on disk (paths are relative to it), for the command-line tools. */
const createFsWorkStore = (root: string): WorkStore => ({
  readBytes: async (path) => {
    try {
      return new Uint8Array(await readFile(join(root, path)));
    } catch (e) {
      if (isMissing(e)) return null;
      throw e;
    }
  },
  writeBytes: async (path, data) => {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), data);
  },
  exists: (path) =>
    access(join(root, path)).then(
      () => true,
      () => false,
    ),
});

export { createFsWorkStore };
