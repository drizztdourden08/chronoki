/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '@chronoki/game-core';
import { CT_OPTION_CATALOG } from '@chronoki/game-core';

const isOptionValue = (value: unknown): value is string | number | boolean =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const ctValuesOf = (options: Readonly<Record<string, unknown>>): CtOptionValues =>
  Object.fromEntries(CT_OPTION_CATALOG.map((option) => {
    const value = options[option.key];
    return [option.key, isOptionValue(value) ? value : option.default];
  }));

export { ctValuesOf };
