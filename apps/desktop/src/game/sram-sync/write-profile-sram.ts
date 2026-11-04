/* @layer bridge-wasm @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { createSaveStore } from '@drizztdourden08/brock-port-kit';

const writeProfileSram = async (profileId: string, bytes: Uint8Array): Promise<void> => {
  await createSaveStore(getPlatform().files).sram.write(profileId, bytes);
};

export { writeProfileSram };
