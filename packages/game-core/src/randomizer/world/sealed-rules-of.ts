/* @layer bridge-wasm @kind logic */
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import { CT_KIT } from './ct-kit.constants';
import type { CtRule } from './ct-region-spec.type';
import type { CtWorldKeys } from './ct-world-keys.type';

const sealedRulesOf = (
  base: ReadonlyMap<string, CtRule>,
  treasure: readonly WorldLocation<CtWorldKeys>[],
  sealedCheckIds: ReadonlySet<string> = new Set<string>(),
): Map<string, CtRule> => {
  const rules = new Map(base);
  treasure
    .filter((location) => sealedCheckIds.has(location.key))
    .forEach((location) => rules.set(location.key, CT_KIT.helper('sealed-open')));
  return rules;
};

export { sealedRulesOf };
