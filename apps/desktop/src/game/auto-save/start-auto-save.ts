/* @layer bridge-wasm @kind logic */
import { autoSaveConfig } from './auto-save-config';
import { autoSaveTick } from './auto-save-tick';

const startAutoSave = (): (() => void) => {
  let timer = 0;
  const schedule = (): void => {
    timer = window.setTimeout(() => {
      void autoSaveTick().finally(schedule);
    }, autoSaveConfig.intervalSeconds * 1000);
  };
  schedule();
  return () => window.clearTimeout(timer);
};

export { startAutoSave };
