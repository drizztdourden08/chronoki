/* @layer bridge-wasm @kind logic */
import { prepareQolAssets } from '../qol';
import { prepareSeededAssets } from './prepare-seeded-assets';
import { reportBootRefusal } from './report-boot-refusal';

const prepareBootAssets = async (profileId: string | null, assets: Uint8Array): Promise<Uint8Array | null> => {
  const seeded = await prepareSeededAssets(profileId, assets);
  if (!seeded.ok) {
    reportBootRefusal(seeded.reason);
    return null;
  }
  return prepareQolAssets(seeded.assets);
};

export { prepareBootAssets };
