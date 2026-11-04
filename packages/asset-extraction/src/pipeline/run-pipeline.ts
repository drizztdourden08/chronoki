/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from './import-context.type';
import { createStageRunner } from './create-stage-runner';
import { planGroups } from './plan-groups';
import { runBatch } from './run-batch';
import type { ProgressEvent, ProgressKind, ProgressSink } from './progress.type';
import { GROUP_PLAN } from './stage-groups.constants';
import { STAGES } from './stages.constants';
import type { ImportStage } from './stage.type';
import type { PipelineResult } from './run-pipeline.type';

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
  const runOne = createStageRunner(ctx, { result, hooks: { emit, finish } });
  for (const batch of planGroups(stages)) {
    await runBatch(batch, ctx.jobs, runOne);
    if (GROUP_PLAN[batch.group].fatal && result.failed.length > 0) break;
  }
  result.complete = result.skipped.length === 0 && result.failed.length === 0;
  const last = stages[stages.length - 1] as ImportStage;
  emit('import-done', last);
  return result;
};

export { runPipeline };
