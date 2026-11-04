/* @layer shared-asset-extraction @kind logic */
import { createLimiter } from './limit';
import type { StageBatch } from './plan-groups.type';
import { GROUP_PLAN } from './stage-groups.constants';
import type { RunOne } from './stage-runner.type';

const runBatch = async (batch: StageBatch, jobs: number, runOne: RunOne): Promise<void> => {
  const plan = GROUP_PLAN[batch.group];
  if (plan.parallel) {
    const limit = createLimiter(jobs);
    await Promise.all(batch.stages.map((s) => limit(() => runOne(s))));
    return;
  }
  for (const s of batch.stages) {
    const ok = await runOne(s);
    if (!ok && plan.fatal) break;
  }
};

export { runBatch };
