/* @layer bridge-wasm @kind type */
import type { RandomizerOptions } from '@drizztdourden08/brock-randomizer';
import type { CheckDef, CtStartParty, GiftWatch, PackPlacementPlan, SaveLoadWatch } from '@chronoki/game-core';
import type { StartHooks } from './start-hooks.type';

type AppliedSeed = {
  profileId: string;
  seed: string;
  checks: readonly CheckDef[];
  plan: PackPlacementPlan;
  party: CtStartParty;
  options: RandomizerOptions;
  sealedCheckIds: readonly string[];
};

type LocalReceivedItem = { checkId: string; item: string };

type LocalRun = {
  seed: AppliedSeed;
  gifts: GiftWatch;
  saveLoad: SaveLoadWatch;
  start: StartHooks;
  received: LocalReceivedItem[];
};

export type { AppliedSeed, LocalReceivedItem, LocalRun };
