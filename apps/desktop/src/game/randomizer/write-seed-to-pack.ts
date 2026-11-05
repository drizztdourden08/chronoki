/* @layer bridge-wasm @kind logic */
import type { ScriptSplice } from '@chronoki/game-core';
import { applyOptionsOf, applySeedToPack, deriveSealedCheckIds, planPackPlacement, planSeedSplices } from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { REFUSED_SAMPLE } from './chronoki-randomizer.constants';
import { localRunHolder } from './local-run-holder';
import { startPartyOf } from './start-party-of';
import type { SeededAssets } from './seeded-assets.type';
import type { WriteSeedInput } from './write-seed-to-pack.type';

const writeSeedToPack = ({ profileId, placement, checks, assets, options }: WriteSeedInput): SeededAssets => {
  const plan = planPackPlacement(placement, checks);
  const party = startPartyOf(placement);
  let splices: ScriptSplice[];
  try {
    splices = planSeedSplices(options, party);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const written = applySeedToPack(assets, plan.pack, splices, applyOptionsOf(options, placement.spheres, placement.seed));
  if (!written.ok) {
    const sample = written.failed.slice(0, REFUSED_SAMPLE).join(', ');
    return { ok: false, reason: `The seed does not fit this game pack: ${written.failed.length} checks refused (${sample})` };
  }
  const sealedCheckIds = [...deriveSealedCheckIds(assets)].sort();
  localRunHolder.applied = { profileId, seed: placement.seed, checks, plan, party, options, sealedCheckIds };
  appRandomizerLog(`[Boot] Seed ${placement.seed} written to the game pack: ${written.edits} edits, ${Object.keys(plan.pack).length} checks`);
  return { ok: true, assets: written.bytes };
};

export { writeSeedToPack };
