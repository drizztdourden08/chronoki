/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { prepareSeededAssets } from './prepare-seeded-assets';
import { reportBootRefusal } from './report-boot-refusal';

const prepareBootAssets = async (profileId: string | null, assets: Uint8Array, files: FileStore): Promise<Uint8Array | null> => {
  const seeded = await prepareSeededAssets(profileId, assets, files);
  if (seeded.ok) return seeded.assets;
  reportBootRefusal(seeded.reason);
  return null;
};

export { prepareBootAssets };
