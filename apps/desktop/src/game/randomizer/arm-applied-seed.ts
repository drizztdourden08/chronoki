/* @layer bridge-wasm @kind logic */
import type { ApplyContext, ApplyResult } from '@drizztdourden08/brock-randomizer/session';
import { ctPollEntries, isCtKeyItem } from '@chronoki/game-core';
import type { CtItem } from '@chronoki/game-core';
import { armedCountsOf } from './armed-counts-of';
import { createLocalRun } from './create-local-run';
import type { AppliedSeed, LocalRun } from './local-run.type';
import { receiveLocalItem } from './receive-local-item';

const armAppliedSeed = (applied: AppliedSeed, ctx: ApplyContext): { run: LocalRun; result: ApplyResult<unknown> } => {
  const run = createLocalRun(applied);
  const polled = ctPollEntries(applied.checks, applied.plan.pack);
  const ids = new Set(applied.checks.map((check) => check.id));
  const spots = applied.plan.virtual
    .filter(([location, item]) => !ids.has(location) && isCtKeyItem(item as CtItem))
    .map(([location, item]) => `${location}: ${item}`);
  if (spots.length > 0) {
    ctx.log(`${ctx.tag} ${spots.length} key items sit on spots with no check binding (${spots.join(', ')}): host-tracked only, the game never gives them`);
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
