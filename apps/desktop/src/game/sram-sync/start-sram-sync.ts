/* @layer bridge-wasm @kind logic */
import type { SramStore } from '@drizztdourden08/brock-port-kit';
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import { createSramSync } from '@drizztdourden08/brock-port-kit/renderer';
import type { CkSettings } from '@chronoki/game-core';
import { SRAM_SYNC_MS } from '@chronoki/game-core';
import { safeSramStore } from './safe-sram-store';
import { sramSyncHolder } from './sram-sync-holder';
import { stopSramSync } from './stop-sram-sync';

const startSramSync = (core: GameCore<CkSettings>, sram: SramStore, profileId: string): void => {
  void stopSramSync();
  const sync = createSramSync({ core, store: safeSramStore(sram), profileId, intervalMs: SRAM_SYNC_MS });
  sramSyncHolder.current = sync;
  sync.start();
};

export { startSramSync };
