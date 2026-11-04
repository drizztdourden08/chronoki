/* @layer shared-asset-extraction @kind logic */
import type { PipelineResult } from '../pipeline/run-pipeline.type';

const failureLine = (result: PipelineResult): string => {
  const first = result.failed[0];
  return `import failed at ${first?.stageId ?? '?'}: ${first?.message ?? ''}`;
};

export { failureLine };
