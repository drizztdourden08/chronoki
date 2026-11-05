/* @layer bridge-wasm @kind constants */
import type { CtOptionDef } from '../ct-option-def.type';
import type { CtOptionKey } from '../ct-world-keys.type';
import { TAB_MAX_AMOUNT, TAB_VANILLA_AMOUNT } from './tab.constants';

const TAB_AMOUNT_CHOICES: readonly number[] = Array.from(
  { length: TAB_MAX_AMOUNT - TAB_VANILLA_AMOUNT + 1 }, (_, i) => TAB_VANILLA_AMOUNT + i,
);

const rangeOption = (key: CtOptionKey, label: string): CtOptionDef => ({
  key, label, jotFlag: '-', default: TAB_VANILLA_AMOUNT, choices: TAB_AMOUNT_CHOICES, section: 'Tabs', implemented: true,
});

const TAB_RANGE_OPTIONS: readonly CtOptionDef[] = [
  rangeOption('powerTabMin', 'Power tab minimum'),
  rangeOption('powerTabMax', 'Power tab maximum'),
  rangeOption('magicTabMin', 'Magic tab minimum'),
  rangeOption('magicTabMax', 'Magic tab maximum'),
  rangeOption('speedTabMin', 'Speed tab minimum'),
  rangeOption('speedTabMax', 'Speed tab maximum'),
];

export { TAB_RANGE_OPTIONS };
