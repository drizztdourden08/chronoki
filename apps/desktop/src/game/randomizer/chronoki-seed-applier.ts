/* @layer bridge-wasm @kind logic */
import type { ApplyResult, SeedApplier } from '@drizztdourden08/brock-randomizer/session';
import type { CtPlacement } from '@chronoki/game-core';
import { armAppliedSeed } from './arm-applied-seed';
import { NOT_APPLIED_REFUSAL } from './chronoki-randomizer.constants';
import { localRunHolder } from './local-run-holder';
import { onAnyLoad } from './on-any-load';

const REFUSED: ApplyResult<unknown> = { ok: false, refusal: NOT_APPLIED_REFUSAL };

let stopLoadWatch: (() => void) | null = null;

const revert = (): void => {
  stopLoadWatch?.();
  stopLoadWatch = null;
  localRunHolder.run = null;
};

const chronokiSeedApplier: SeedApplier<CtPlacement, unknown> = {
  apply: (placement, ctx) => {
    const applied = localRunHolder.applied;
    if (applied === null || applied.seed !== placement.seed) return Promise.resolve(REFUSED);
    revert();
    const { run, result } = armAppliedSeed(applied, ctx);
    localRunHolder.run = run;
    stopLoadWatch = onAnyLoad(() => {
      run.gifts.reset();
      run.saveLoad.reset();
    });
    return Promise.resolve(result);
  },
  revert,
};

export { chronokiSeedApplier };
