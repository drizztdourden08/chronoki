/* @layer shared-asset-extraction @kind logic */
import type { Generator } from './manifest.type';

const stageOf = (g: Generator): string => g.stage ?? 'data';

export { stageOf };
