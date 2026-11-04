/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from './work-store.type';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const writeText = (store: WorkStore, path: string, text: string): Promise<void> =>
  store.writeBytes(path, encoder.encode(text));

const readText = async (store: WorkStore, path: string): Promise<string | null> => {
  const bytes = await store.readBytes(path);
  return bytes === null ? null : decoder.decode(bytes);
};

const requireBytes = async (store: WorkStore, path: string): Promise<Uint8Array> => {
  const bytes = await store.readBytes(path);
  if (bytes === null) throw new Error(`${path} is missing: the stage that makes it did not run`);
  return bytes;
};

export { readText, requireBytes, writeText };
