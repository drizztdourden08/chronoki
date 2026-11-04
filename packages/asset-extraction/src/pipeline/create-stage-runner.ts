/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from './import-context.type';
import { skipReason } from './skip-reason';
import type { RunOne, StageRunnerEnv } from './stage-runner.type';

const createStageRunner =
  (ctx: ImportContext, { result, hooks }: StageRunnerEnv): RunOne =>
  async (s) => {
    const reason = skipReason(s, ctx);
    if (reason !== null || s.run === null) {
      result.skipped.push(s.id);
      hooks.finish('stage-skipped', s, reason ?? 'skipped');
      return true;
    }
    hooks.emit('stage-start', s);
    try {
      await s.run(ctx);
      result.done.push(s.id);
      hooks.finish('stage-done', s);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      result.failed.push({ stageId: s.id, message });
      hooks.finish('stage-failed', s, message);
      return false;
    }
  };

export { createStageRunner };
