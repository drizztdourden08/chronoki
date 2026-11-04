/* @layer shared-asset-extraction @kind types */
interface PipelineResult {
  complete: boolean;
  done: string[];
  skipped: string[];
  failed: { stageId: string; message: string }[];
}

export type { PipelineResult };
