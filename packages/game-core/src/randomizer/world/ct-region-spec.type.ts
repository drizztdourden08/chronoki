/* @layer bridge-wasm @kind type */
import type { RuleNode } from '@drizztdourden08/brock-randomizer/world';
import type { CtEra, CtEventId, CtRegionId, CtSpotId, CtWorldKeys } from './ct-world-keys.type';

type CtRule = RuleNode<CtWorldKeys>;

type CtExitSpec = { to: CtRegionId; rule?: CtRule };

type CtSpotSpec = { id: CtSpotId; name: string; rule?: CtRule };

type CtEventSpec = { id: CtEventId; rule?: CtRule };

type CtRegionSpec = {
  id: CtRegionId;
  name: string;
  era: CtEra;
  exits: readonly CtExitSpec[];
  spots: readonly CtSpotSpec[];
  events: readonly CtEventSpec[];
  maps: readonly number[];
};

export type { CtEventSpec, CtExitSpec, CtRegionSpec, CtRule, CtSpotSpec };
