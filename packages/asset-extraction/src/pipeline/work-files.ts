/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from './work-store.type';
import { requireBytes } from './require-bytes';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const writeText = (store: WorkStore, path: string, text: string): Promise<void> =>
  store.writeBytes(path, encoder.encode(text));

const readText = async (store: WorkStore, path: string): Promise<string | null> => {
  const bytes = await store.readBytes(path);
  return bytes === null ? null : decoder.decode(bytes);
};

export { readText, writeText };
