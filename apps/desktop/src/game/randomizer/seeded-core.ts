/* @layer bridge-wasm @kind logic */
import type { GameCore } from '@drizztdourden08/brock-port-kit/renderer';
import type { CkSettings } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { prepareSeededAssets } from './prepare-seeded-assets';
import { reportBootRefusal } from './report-boot-refusal';

const seededCore = (profileId: string | null): GameCore<CkSettings> => ({
  ...chronokiCore,
  start: async (boot) => {
    const seeded = await prepareSeededAssets(profileId, boot.assets);
    if (!seeded.ok) {
      reportBootRefusal(seeded.reason);
      return;
    }
    await chronokiCore.start({ ...boot, assets: seeded.assets });
  },
});

export { seededCore };
