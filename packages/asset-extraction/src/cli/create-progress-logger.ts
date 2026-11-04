/* @layer shared-asset-extraction @kind logic */
import type { ProgressSink } from '../pipeline/progress.type';
import type { ImportStage } from '../pipeline/stage.type';
import { errLine } from './err-line';
import { outLine } from './out-line';

const createProgressLogger = (stages: ImportStage[]): ProgressSink => {
  const startedAt = new Map<string, number>();
  const total = stages.length;
  return (event) => {
    if (event.kind === 'stage-start') {
      startedAt.set(event.stageId, performance.now());
      return;
    }
    if (event.kind === 'import-done') return;
    const n = stages.findIndex((s) => s.id === event.stageId) + 1;
    const ms = Math.round(performance.now() - (startedAt.get(event.stageId) ?? performance.now()));
    const head = `[${n}/${total}] ${event.stageId}:`;
    if (event.kind === 'stage-done') outLine(`${head} ok (${ms} ms)`);
    else if (event.kind === 'stage-skipped') outLine(`${head} skip (${event.message ?? 'skipped'})`);
    else errLine(`${head} fail (${ms} ms)\n  ${event.message ?? 'no message'}`);
  };
};

export { createProgressLogger };
