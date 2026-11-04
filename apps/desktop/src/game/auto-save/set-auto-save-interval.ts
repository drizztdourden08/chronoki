/* @layer bridge-wasm @kind logic */
import { autoSaveConfig } from './auto-save-config';
import { AUTO_SAVE_MAX_SECONDS, AUTO_SAVE_MIN_SECONDS } from './auto-save.constants';

const setAutoSaveInterval = (seconds: number): void => {
  autoSaveConfig.intervalSeconds = Math.max(AUTO_SAVE_MIN_SECONDS, Math.min(AUTO_SAVE_MAX_SECONDS, seconds));
};

export { setAutoSaveInterval };
