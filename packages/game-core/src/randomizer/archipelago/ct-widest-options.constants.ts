/* @layer bridge-wasm @kind constants */
import { CT_OPTION_CATALOG } from '../world/ct-options.constants';
import type { CtOptionValues } from '../world/ct-world-input.type';

const WIDEST_SKIPPED_KEYS: readonly string[] = ['mysterySeed'];

const widestOptions = (): CtOptionValues => {
  const values: { -readonly [K in keyof CtOptionValues]: CtOptionValues[K] } = {};
  for (const option of CT_OPTION_CATALOG) {
    const on = option.implemented && option.frozen !== true && option.default === false
      && !WIDEST_SKIPPED_KEYS.includes(option.key);
    if (on) values[option.key] = true;
  }
  return values;
};

const CT_WIDEST_OPTIONS: CtOptionValues = widestOptions();

export { CT_WIDEST_OPTIONS };
