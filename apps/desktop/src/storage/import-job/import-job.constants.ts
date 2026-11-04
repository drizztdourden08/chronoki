/* @layer renderer-lib @kind constants */
import type { ImportKind, ImportPhase } from './import-job.type';

const PHASE_VERB: Record<ImportPhase, string> = {
  extract: 'Extracting',
  copy: 'Copying',
};

const importJobId = (kind: ImportKind): string => `import:${kind}`;

export { importJobId, PHASE_VERB };
