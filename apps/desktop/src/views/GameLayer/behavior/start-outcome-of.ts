/* @layer renderer-components @kind logic */
import type { StartOutcome, StartResult } from '../GameLayer.type';

const startOutcomeOf = ({ ok, stale }: StartResult): StartOutcome => {
  if (stale) return 'ignore';
  return ok ? 'started' : 'abandon';
};

export { startOutcomeOf };
