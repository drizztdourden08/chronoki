/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from './work-store.type';

const decoder = new TextDecoder();

const readText = async (store: WorkStore, path: string): Promise<string | null> => {
  const bytes = await store.readBytes(path);
  return bytes === null ? null : decoder.decode(bytes);
};

export { readText };
