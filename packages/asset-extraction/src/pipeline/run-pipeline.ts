/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from './import-context.type';
import { createLimiter } from './limit';
import { planGroups } from './plan-groups';
import type { ProgressEvent, ProgressKind, ProgressSink } from './progress.type';
import { GROUP_PLAN } from './stage-groups.constants';
import { STAGES } from './stages';
import type { ImportStage } from './stage.type';

interface PipelineResult {
  /** True when every stage ran: nothing skipped and nothing failed. */
  complete: boolean;
  done: string[];
  skipped: string[];
  failed: { stageId: string; message: string }[];
}

const skipReason = (s: ImportStage, ctx: ImportContext): string | null => {
  if (s.run === null) return `not ported yet (${s.python})`;
  if (s.needs.includes('oracle') && ctx.oracle === null) return 'needs the oracle';
  return null;
};

/** Runs the registry in order (setup.py main): serial or side-by-side per group, progress events like RotP's. */
const runPipeline = async (
  ctx: ImportContext,
  onProgress: ProgressSink = () => undefined,
  stages: ImportStage[] = STAGES,
): Promise<PipelineResult> => {
  const result: PipelineResult = { complete: false, done: [], skipped: [], failed: [] };
  const steps = stages.filter((s) => s.step).length;
  const totalWeight = stages.reduce((sum, s) => sum + s.weight, 0);
  let step = 0;
  let weightDone = 0;
  const emit = (kind: ProgressKind, s: ImportStage, message?: string): void => {
    const event: ProgressEvent = { kind, stageId: s.id, label: s.label, step, steps, fraction: weightDone / totalWeight };
    onProgress(message === undefined ? event : { ...event, message });
  };
  const finish = (kind: ProgressKind, s: ImportStage, message?: string): void => {
    weightDone += s.weight;
    if (s.step) step += 1;
    emit(kind, s, message);
  };
  const runOne = async (s: ImportStage): Promise<boolean> => {
    const reason = skipReason(s, ctx);
    if (reason !== null || s.run === null) {
      result.skipped.push(s.id);
      finish('stage-skipped', s, reason ?? 'skipped');
      return true;
    }
    emit('stage-start', s);
    try {
      await s.run(ctx);
      result.done.push(s.id);
      finish('stage-done', s);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.failed.push({ stageId: s.id, message });
      finish('stage-failed', s, message);
      return false;
    }
  };
  for (const batch of planGroups(stages)) {
    const plan = GROUP_PLAN[batch.group];
    if (plan.parallel) {
      const limit = createLimiter(ctx.jobs);
      await Promise.all(batch.stages.map((s) => limit(() => runOne(s))));
    } else {
      for (const s of batch.stages) {
        const ok = await runOne(s);
        if (!ok && plan.fatal) break;
      }
    }
    if (plan.fatal && result.failed.length > 0) break;
  }
  result.complete = result.skipped.length === 0 && result.failed.length === 0;
  const last = stages[stages.length - 1] as ImportStage;
  emit('import-done', last);
  return result;
};

export { runPipeline };
export type { PipelineResult };
