/* @layer bridge-wasm @kind logic */
import { flushSramSync } from '../sram-sync';

const saveOnQuit = async (): Promise<void> => {
  await flushSramSync();
};

export { saveOnQuit };
