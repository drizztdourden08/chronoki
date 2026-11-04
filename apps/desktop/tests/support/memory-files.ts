/* @layer tests @kind test */
import type { FileStore } from '@drizztdourden08/brock-core';

const memoryFiles = (): FileStore => {
  const data = new Map<string, Uint8Array>();
  return {
    readBytes: (path) => Promise.resolve(data.get(path) ?? null),
    readText: (path) => {
      const bytes = data.get(path);
      return Promise.resolve(bytes ? new TextDecoder().decode(bytes) : null);
    },
    writeBytes: (path, bytes) => {
      data.set(path, bytes);
      return Promise.resolve();
    },
    writeText: (path, text) => {
      data.set(path, new TextEncoder().encode(text));
      return Promise.resolve();
    },
    list: () => Promise.resolve([...data.keys()]),
    remove: (path) => {
      data.delete(path);
      return Promise.resolve();
    },
    exists: (path) => Promise.resolve(data.has(path)),
    mkdir: () => Promise.resolve(),
    stat: () => Promise.resolve(null),
  };
};

export { memoryFiles };
