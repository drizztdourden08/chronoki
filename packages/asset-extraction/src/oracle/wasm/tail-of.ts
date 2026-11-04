/* @layer shared-asset-extraction @kind logic */
import type { CtOutcome } from './ct-invocation.type';

const tailOf = (outcome: CtOutcome): string => [...outcome.stdout.slice(-8), ...outcome.stderr.slice(-8)].join('\n');

export { tailOf };
