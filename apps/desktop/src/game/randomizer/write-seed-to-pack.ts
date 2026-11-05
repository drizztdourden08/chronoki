/* @layer bridge-wasm @kind logic */
import type { RandomizerOptions } from '@drizztdourden08/brock-randomizer';
import type { CheckDef, CtOptionValues, CtPlacement, ItemDifficulty, ScriptSplice } from '@chronoki/game-core';
import { START_STATES, applySeedToPack, modeOf, planPackPlacement, planStartState } from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { REFUSED_SAMPLE } from './chronoki-randomizer.constants';
import { localRunHolder } from './local-run-holder';
import type { SeededAssets } from './seeded-assets.type';

const splicesOf = (options: RandomizerOptions): ScriptSplice[] => {
  const state = START_STATES[modeOf(options as CtOptionValues).startState];
  if (state === undefined) throw new Error('This game mode has no start state yet.');
  return [planStartState(state)];
};

const writeSeedToPack = (
  profileId: string, placement: CtPlacement, checks: readonly CheckDef[], assets: Uint8Array, options: RandomizerOptions,
): SeededAssets => {
  const plan = planPackPlacement(placement, checks);
  let splices: ScriptSplice[];
  try {
    splices = splicesOf(options);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const difficulty = (options.itemDifficulty ?? 'normal') as ItemDifficulty;
  const written = applySeedToPack(assets, plan.pack, splices, { difficulty });
  if (!written.ok) {
    const sample = written.failed.slice(0, REFUSED_SAMPLE).join(', ');
    return { ok: false, reason: `The seed does not fit this game pack: ${written.failed.length} checks refused (${sample})` };
  }
  localRunHolder.applied = { profileId, seed: placement.seed, checks, plan };
  appRandomizerLog(`[Boot] Seed ${placement.seed} written to the game pack: ${written.edits} edits, ${Object.keys(plan.pack).length} checks`);
  return { ok: true, assets: written.bytes };
};

export { writeSeedToPack };
