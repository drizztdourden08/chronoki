/* @layer bridge-wasm @kind logic */
import { createGiftWatch, createSaveLoadWatch, giftTargetsOf } from '@chronoki/game-core';
import { createStartHooks } from './create-start-hooks';
import type { AppliedSeed, LocalRun } from './local-run.type';
import { randomizerConfigOf } from './randomizer-config-of';

const createLocalRun = (seed: AppliedSeed): LocalRun => ({
  seed,
  start: createStartHooks(randomizerConfigOf(seed.profileId)?.options ?? {}, seed.party, seed.seed),
  gifts: createGiftWatch(giftTargetsOf(seed.checks, seed.plan.pack)),
  saveLoad: createSaveLoadWatch(),
  received: [],
});

export { createLocalRun };
