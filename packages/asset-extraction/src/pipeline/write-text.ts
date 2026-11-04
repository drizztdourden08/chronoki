/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from './work-store.type';

const encoder = new TextEncoder();

const writeText = (store: WorkStore, path: string, text: string): Promise<void> =>
  store.writeBytes(path, encoder.encode(text));

export { writeText };
