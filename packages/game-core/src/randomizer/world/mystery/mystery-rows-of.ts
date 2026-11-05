/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import { CT_OPTION_CATALOG } from '../ct-options.constants';
import type { MysteryRow } from './mystery-rows-of.type';

const valueLabelOf = (labels: Readonly<Record<string, string>> | undefined, value: unknown): string => {
  if (typeof value === 'boolean') return value ? 'On' : 'Off';
  return labels?.[String(value)] ?? String(value);
};

const mysteryRowsOf = (mystery: CtOptionValues | undefined): readonly MysteryRow[] =>
  mystery === undefined ? [] : [
    { label: 'Mystery seed', value: 'Settings hidden' },
    ...CT_OPTION_CATALOG.filter((option) => mystery[option.key] !== undefined)
      .map((option) => ({ label: `Mystery settings: ${option.label}`, value: valueLabelOf(option.choiceLabels, mystery[option.key]) })),
  ];

export { mysteryRowsOf };
