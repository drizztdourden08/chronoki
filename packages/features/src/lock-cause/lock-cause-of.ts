/* @layer shared @kind logic */
import { FEATURES_BY_ID } from '../feature-registry/features-by-id.constants';
import type { LockCause, LockCauseContext } from './lock-cause.type';

const lockCauseOf = (id: string, context: LockCauseContext): LockCause | null => {
  const def = FEATURES_BY_ID[id];
  if (!def) return null;
  if (context.vanillaSafe && def.affectsVanillaParity) return 'vanillaSafe';
  if (context.packaged === true && def.kind === 'dev') return 'developerBuild';
  const satisfied = context.satisfied ?? new Set<string>();
  return (def.requiresData ?? []).some((required) => !satisfied.has(required)) ? 'missingData' : null;
};

export { lockCauseOf };
