/* @layer renderer-lib @kind constants */
import type { AssetWebWorkerJobOptions } from '@drizztdourden08/brock-port-kit/renderer';
import type { ExtractStepId } from '@app/game/extract-steps';

const STEP_JOB_OPTIONS: Record<ExtractStepId, Pick<AssetWebWorkerJobOptions, 'visible' | 'forwardLog' | 'onDuplicate'>> = {
  assets: { onDuplicate: 'queue', forwardLog: true },
  steam: { onDuplicate: 'queue', forwardLog: true },
  sprites: { onDuplicate: 'queue', forwardLog: true },
};

export { STEP_JOB_OPTIONS };
