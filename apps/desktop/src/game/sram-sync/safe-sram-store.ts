/* @layer bridge-wasm @kind logic */
import type { SramStore } from '@drizztdourden08/brock-port-kit';
import { appLog } from '@app/log/app-log';

const safeSramStore = (sram: SramStore): SramStore => ({
  read: (profileId) => sram.read(profileId),
  write: async (profileId, bytes) => {
    try {
      await sram.write(profileId, bytes);
    } catch (error) {
      appLog.warn('[SRAM] Sync failed', error);
    }
  },
});

export { safeSramStore };
