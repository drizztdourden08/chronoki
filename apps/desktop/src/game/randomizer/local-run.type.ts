/* @layer bridge-wasm @kind type */
import type { CheckDef, GiftWatch, PackPlacementPlan, SaveLoadWatch } from '@chronoki/game-core';

type AppliedSeed = {
  profileId: string;
  seed: string;
  checks: readonly CheckDef[];
  plan: PackPlacementPlan;
};

type LocalReceivedItem = { checkId: string; item: string };

type LocalRun = {
  seed: AppliedSeed;
  gifts: GiftWatch;
  saveLoad: SaveLoadWatch;
  received: LocalReceivedItem[];
};

export type { AppliedSeed, LocalReceivedItem, LocalRun };
