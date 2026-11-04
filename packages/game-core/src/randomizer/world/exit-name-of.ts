/* @layer bridge-wasm @kind logic */
import type { CtRegionId } from './ct-world-keys.type';

const exitNameOf = (source: CtRegionId, target: CtRegionId): string => `${source}->${target}`;

export { exitNameOf };
