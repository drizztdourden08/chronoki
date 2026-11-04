/* @layer renderer-appshell @kind logic */
import type { StateResult } from '@app/game/save-states';

const outcomeOf = (result: StateResult | null): string => {
  if (result === null) return 'skipped';
  return result.ok ? 'ok' : result.reason;
};

export { outcomeOf };
