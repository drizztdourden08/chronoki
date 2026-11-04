/* @layer bridge-wasm @kind logic */
import type { SramStore } from '@drizztdourden08/brock-port-kit';

const safeSramStore = (sram: SramStore): SramStore => ({
  read: (profileId) => sram.read(profileId),
  write: async (profileId, bytes) => {
    try {
      await sram.write(profileId, bytes);
    } catch (error) {
      console.warn(`[SRAM] Sync failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

export { safeSramStore };
