/* @layer bridge-wasm @kind logic */
import type { CheckDef, CtPlacement } from '@chronoki/game-core';
import { applySeedToPack, planPackPlacement } from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { REFUSED_SAMPLE } from './chronoki-randomizer.constants';
import { localRunHolder } from './local-run-holder';
import type { SeededAssets } from './seeded-assets.type';
import { checksCache } from './tracker/checks-cache';

const writeSeedToPack = (profileId: string, placement: CtPlacement, checks: readonly CheckDef[], assets: Uint8Array): SeededAssets => {
  const plan = planPackPlacement(placement, checks);
  const written = applySeedToPack(assets, plan.pack);
  if (!written.ok) {
    const sample = written.failed.slice(0, REFUSED_SAMPLE).join(', ');
    return { ok: false, reason: `The seed does not fit this game pack: ${written.failed.length} checks refused (${sample})` };
  }
  checksCache.remember(profileId, checks);
  localRunHolder.applied = { profileId, seed: placement.seed, checks, plan };
  appRandomizerLog(`[Boot] Seed ${placement.seed} written to the game pack: ${written.edits} edits, ${Object.keys(plan.pack).length} checks`);
  return { ok: true, assets: written.bytes };
};

export { writeSeedToPack };
