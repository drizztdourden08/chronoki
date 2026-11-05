/* @layer renderer-components @kind logic */
import type { RunTile } from '@drizztdourden08/brock-randomizer/renderer';
import type { CtPool } from './ct-pool.type';

const ctPoolTilesOf = (pool: CtPool): RunTile[] => [
  { label: 'Locations', value: pool.locations },
  { label: 'Key items', value: pool.progression.length },
  { label: 'Items', value: pool.rest.length },
];

export { ctPoolTilesOf };
