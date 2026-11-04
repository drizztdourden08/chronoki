/* @layer bridge-wasm @kind logic */
import type { ApplyContext, ApplyResult } from '@drizztdourden08/brock-randomizer/session';
import { ctPollEntries } from '@chronoki/game-core';
import { armedCountsOf } from './armed-counts-of';
import { createLocalRun } from './create-local-run';
import type { AppliedSeed, LocalRun } from './local-run.type';
import { receiveLocalItem } from './receive-local-item';

const armAppliedSeed = (applied: AppliedSeed, ctx: ApplyContext): { run: LocalRun; result: ApplyResult<unknown> } => {
  const run = createLocalRun(applied);
  const polled = ctPollEntries(applied.checks, applied.plan.pack);
  if (applied.plan.unbound > 0) {
    ctx.log(`${ctx.tag} ${applied.plan.unbound} key-item spots have no check binding yet: their items are host-tracked only`);
  }
  return {
    run,
    result: {
      ok: true,
      armed: {
        polled,
        counts: armedCountsOf(applied, polled),
        onCheck: (key) => receiveLocalItem(run, key, ctx.tag, ctx.log),
      },
    },
  };
};

export { armAppliedSeed };
