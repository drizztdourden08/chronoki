/* @layer bridge-wasm @kind logic */
import { autoSaveConfig } from './auto-save-config';
import { AUTO_SAVE_MAX_ENTRIES, AUTO_SAVE_MIN_ENTRIES } from './auto-save.constants';

const setAutoSaveMaxEntries = (entries: number): void => {
  autoSaveConfig.maxEntries = Math.max(AUTO_SAVE_MIN_ENTRIES, Math.min(AUTO_SAVE_MAX_ENTRIES, Math.round(entries)));
};

export { setAutoSaveMaxEntries };
