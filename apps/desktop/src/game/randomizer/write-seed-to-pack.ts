/* @layer bridge-wasm @kind logic */
import type { RandomizerOptions } from '@drizztdourden08/brock-randomizer';
import type { CtStartParty, ItemDifficulty, ScriptSplice } from '@chronoki/game-core';
import { START_STATES, applySeedToPack, modeOf, planPackPlacement, planStartState } from '@chronoki/game-core';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/session';
import { REFUSED_SAMPLE } from './chronoki-randomizer.constants';
import { localRunHolder } from './local-run-holder';
import { startPartyOf } from './start-party-of';
import type { SeededAssets } from './seeded-assets.type';
import type { WriteSeedInput } from './write-seed-to-pack.type';

const splicesOf = (options: RandomizerOptions, party: CtStartParty): ScriptSplice[] => {
  const state = START_STATES[modeOf(options).startState];
  if (state === undefined) throw new Error('This game mode has no start state yet.');
  return [planStartState(state, party)];
};

const writeSeedToPack = ({ profileId, placement, checks, assets, options }: WriteSeedInput): SeededAssets => {
  const plan = planPackPlacement(placement, checks);
  const party = startPartyOf(placement);
  let splices: ScriptSplice[];
  try {
    splices = splicesOf(options, party);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const difficulty = (options.itemDifficulty ?? 'normal') as ItemDifficulty;
  const written = applySeedToPack(assets, plan.pack, splices, { difficulty });
  if (!written.ok) {
    const sample = written.failed.slice(0, REFUSED_SAMPLE).join(', ');
    return { ok: false, reason: `The seed does not fit this game pack: ${written.failed.length} checks refused (${sample})` };
  }
  localRunHolder.applied = { profileId, seed: placement.seed, checks, plan, party };
  appRandomizerLog(`[Boot] Seed ${placement.seed} written to the game pack: ${written.edits} edits, ${Object.keys(plan.pack).length} checks`);
  return { ok: true, assets: written.bytes };
};

export { writeSeedToPack };
