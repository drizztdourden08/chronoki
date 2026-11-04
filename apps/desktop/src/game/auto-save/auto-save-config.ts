/* @layer bridge-wasm @kind logic */
import { AUTO_SAVE_DEFAULT_ENTRIES, AUTO_SAVE_DEFAULT_SECONDS } from './auto-save.constants';

const autoSaveConfig: { intervalSeconds: number; maxEntries: number } = {
  intervalSeconds: AUTO_SAVE_DEFAULT_SECONDS,
  maxEntries: AUTO_SAVE_DEFAULT_ENTRIES,
};

export { autoSaveConfig };
