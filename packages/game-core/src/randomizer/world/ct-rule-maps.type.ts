/* @layer bridge-wasm @kind type */
import type { CtRule } from './ct-region-spec.type';
import type { CtEventId } from './ct-world-keys.type';

type CtRuleMaps = {
  exitRules: Map<string, CtRule>;
  spotRules: Map<string, CtRule>;
  eventRules: Map<CtEventId, CtRule>;
};

export type { CtRuleMaps };
