/* @layer shared-asset-extraction @kind logic */
import { createLimiter } from './limit';
import type { StageBatch } from './plan-groups.type';
import { GROUP_PLAN } from './stage-groups.constants';
import type { RunOne } from './stage-runner.type';

const runBatch = async (batch: StageBatch, jobs: number, runOne: RunOne): Promise<void> => {
  const plan = GROUP_PLAN[batch.group];
  if (plan.parallel) {
    const limit = createLimiter(jobs);
    const finished = new Map<string, Promise<boolean>>();
    const start = (s: StageBatch['stages'][number]): Promise<boolean> => {
      const settled = Promise.all(s.after.map((id) => finished.get(id) ?? Promise.resolve(true))).then(() => limit(() => runOne(s)));
      finished.set(s.id, settled);
      return settled;
    };
    await Promise.all(batch.stages.map(start));
    return;
  }
  for (const s of batch.stages) {
    const ok = await runOne(s);
    if (!ok && plan.fatal) break;
  }
};

export { runBatch };
