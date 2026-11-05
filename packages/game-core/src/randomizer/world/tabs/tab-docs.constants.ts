/* @layer bridge-wasm @kind constants */
import type { CtOptionDoc } from '../ct-option-docs.type';
import { TAB_MAX_AMOUNT, TAB_VANILLA_AMOUNT } from './tab.constants';

const AMOUNT_RANGE = { min: TAB_VANILLA_AMOUNT, max: TAB_MAX_AMOUNT };

const amountDoc = (group: string, edge: 'fewest' | 'most', stat: string): CtOptionDoc => ({
  group,
  description: `The ${edge} ${stat} tabs a tab spot can hold. Each spot rolls an amount between the minimum and the maximum.`,
  kind: 'range',
  range: AMOUNT_RANGE,
});

const TAB_DOCS = {
  tabsanity: {
    group: 'Placement',
    description: 'Stat tabs become spots of their own, so they can hold any item and the tabs are shuffled into the pool.',
  },
  powerTabMin: amountDoc('Power tabs', 'fewest', 'power'),
  powerTabMax: amountDoc('Power tabs', 'most', 'power'),
  magicTabMin: amountDoc('Magic tabs', 'fewest', 'magic'),
  magicTabMax: amountDoc('Magic tabs', 'most', 'magic'),
  speedTabMin: amountDoc('Speed tabs', 'fewest', 'speed'),
  speedTabMax: amountDoc('Speed tabs', 'most', 'speed'),
} as const;

export { TAB_DOCS };
