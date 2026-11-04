/* @layer bridge-wasm @kind logic */
import type { CtRule } from './ct-region-spec.type';

const ruleMapOf = <Key>(entries: readonly (readonly [Key, CtRule | undefined])[]): Map<Key, CtRule> => {
  const rules = new Map<Key, CtRule>();
  for (const [key, rule] of entries) {
    if (rule !== undefined) rules.set(key, rule);
  }
  return rules;
};

export { ruleMapOf };
