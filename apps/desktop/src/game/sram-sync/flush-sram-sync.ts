/* @layer bridge-wasm @kind logic */
import { sramSyncHolder } from './sram-sync-holder';

const flushSramSync = async (): Promise<boolean> => (await sramSyncHolder.current?.flush()) ?? false;

export { flushSramSync };
