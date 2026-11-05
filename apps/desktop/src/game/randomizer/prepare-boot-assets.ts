/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { prepareQolAssets } from '../qol';
import { prepareSeededAssets } from './prepare-seeded-assets';
import { reportBootRefusal } from './report-boot-refusal';

const prepareBootAssets = async (profileId: string | null, assets: Uint8Array, files: FileStore): Promise<Uint8Array | null> => {
  const seeded = await prepareSeededAssets(profileId, assets, files);
  if (!seeded.ok) {
    reportBootRefusal(seeded.reason);
    return null;
  }
  return prepareQolAssets(seeded.assets);
};

export { prepareBootAssets };
