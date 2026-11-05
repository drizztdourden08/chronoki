/* @layer bridge-wasm @kind logic */
import type { TreasureTier } from './treasure-tier.type';

const poolKeyOf = (kind: string, tier: TreasureTier): string => `${kind}#${tier}`;

export { poolKeyOf };
