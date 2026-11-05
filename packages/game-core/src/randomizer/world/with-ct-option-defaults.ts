/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from './ct-world-input.type';
import { CT_OPTION_CATALOG } from './ct-options.constants';

const withCtOptionDefaults = (options: CtOptionValues = {}): CtOptionValues => {
  const merged: { -readonly [K in keyof CtOptionValues]: CtOptionValues[K] } = {};
  for (const option of CT_OPTION_CATALOG) merged[option.key] = options[option.key] ?? option.default;
  return merged;
};

export { withCtOptionDefaults };
