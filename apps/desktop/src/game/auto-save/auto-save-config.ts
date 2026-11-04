/* @layer bridge-wasm @kind logic */
import { AUTO_SAVE_DEFAULT_SECONDS } from './auto-save.constants';

const autoSaveConfig: { intervalSeconds: number } = { intervalSeconds: AUTO_SAVE_DEFAULT_SECONDS };

export { autoSaveConfig };
