/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from './work-store.type';

const createMemWorkStore = (): WorkStore => {
  const files = new Map<string, Uint8Array>();
  return {
    readBytes: (path) => Promise.resolve(files.get(path) ?? null),
    writeBytes: (path, data) => {
      files.set(path, data);
      return Promise.resolve();
    },
    exists: (path) => Promise.resolve(files.has(path)),
  };
};

export { createMemWorkStore };
