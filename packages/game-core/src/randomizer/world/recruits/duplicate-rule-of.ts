/* @layer bridge-wasm @kind logic */
import type { DuplicateRule } from './duplicate-rule.type';

const duplicateRuleOf = (options: Readonly<Record<string, unknown>>): DuplicateRule => {
  const cap = Number(options.duplicateCap);
  return {
    ...(Number.isInteger(cap) && cap >= 2 ? { cap } : {}),
    ...(options.duplicateAllSlots === true ? { allSlots: true } : {}),
  };
};

export { duplicateRuleOf };
