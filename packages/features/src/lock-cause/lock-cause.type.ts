/* @layer shared @kind types */
type LockCause = 'vanillaSafe' | 'requires' | 'missingData' | 'developerBuild';

interface LockCauseContext {
  vanillaSafe: boolean;
  packaged?: boolean;
  enabled: ReadonlySet<string>;
  satisfied?: ReadonlySet<string>;
}

export type { LockCause, LockCauseContext };
