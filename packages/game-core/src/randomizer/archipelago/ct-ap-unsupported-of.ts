/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../world/ct-world-input.type';
import { CT_AP_LOCKED_OPTIONS, CT_AP_LOCKED_PARTY } from './ct-option-rows.constants';

const refusalOf = (label: string): string => `Online play does not support ${label} yet.`;

const ctApUnsupportedOf = (options: CtOptionValues): readonly string[] => {
  const refusals = (['characterRando', 'duplicateCharacters', 'bucketList'] as const)
    .filter((key) => options[key] === true)
    .map((key) => refusalOf(CT_AP_LOCKED_OPTIONS[key]?.label ?? key));
  const customParty = options.partyMode === 'custom' && options.startingParty !== CT_AP_LOCKED_PARTY;
  return customParty ? [...refusals, refusalOf('a starting party other than Crono and Marle')] : refusals;
};

export { ctApUnsupportedOf };
