/* @layer bridge-wasm @kind logic */
import { sramSyncHolder } from './sram-sync-holder';

const stopSramSync = async (): Promise<void> => {
  const sync = sramSyncHolder.current;
  sramSyncHolder.current = null;
  await sync?.stop();
};

export { stopSramSync };
