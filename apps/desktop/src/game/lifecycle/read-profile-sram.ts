/* @layer bridge-wasm @kind logic */
import type { SramStore } from '@drizztdourden08/brock-port-kit';

const readProfileSram = async (sram: SramStore, profileId: string | null): Promise<Uint8Array | null> =>
  profileId ? sram.read(profileId) : null;

export { readProfileSram };
