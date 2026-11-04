/* @layer bridge-wasm @kind logic */
import { createGiftWatch, createSaveLoadWatch, giftTargetsOf } from '@chronoki/game-core';
import type { AppliedSeed, LocalRun } from './local-run.type';

const createLocalRun = (seed: AppliedSeed): LocalRun => ({
  seed,
  gifts: createGiftWatch(giftTargetsOf(seed.checks, seed.plan.pack)),
  saveLoad: createSaveLoadWatch(),
  received: [],
});

export { createLocalRun };
