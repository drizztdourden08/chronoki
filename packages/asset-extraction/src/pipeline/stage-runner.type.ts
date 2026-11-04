/* @layer shared-asset-extraction @kind types */
import type { ProgressKind } from './progress.type';
import type { PipelineResult } from './run-pipeline.type';
import type { ImportStage } from './stage.type';

interface StageHooks {
  emit: (kind: ProgressKind, s: ImportStage, message?: string) => void;
  finish: (kind: ProgressKind, s: ImportStage, message?: string) => void;
}

interface StageRunnerEnv {
  result: PipelineResult;
  hooks: StageHooks;
}

type RunOne = (s: ImportStage) => Promise<boolean>;

export type { RunOne, StageHooks, StageRunnerEnv };
