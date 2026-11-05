/* @layer bridge-wasm @kind constants */
import { CT_OPTION_CATALOG } from '../world/ct-options.constants';
import type { CtOptionValues } from '../world/ct-world-input.type';
import { CT_MODES } from '../world/modes/ct-modes.constants';
import type { VerifyOptionSet } from './verify-option-set.type';

const SKIPPED_KEYS: readonly string[] = ['gameMode', 'partyMode', 'partySize', 'startingParty'];

const implementedOptions = CT_OPTION_CATALOG.filter((option) => option.implemented && !SKIPPED_KEYS.includes(option.key));

const modeSets: VerifyOptionSet[] = CT_MODES.filter((mode) => mode.implemented)
  .map((mode) => ({ name: `mode:${mode.id}`, options: { gameMode: mode.id } }));

const flippedSets: VerifyOptionSet[] = implementedOptions
  .filter((option) => typeof option.default === 'boolean')
  .map((option) => ({ name: `flip:${option.key}`, options: { [option.key]: !option.default } as CtOptionValues }));

const choiceSets: VerifyOptionSet[] = implementedOptions
  .flatMap((option) => (option.choices ?? [])
    .filter((choice) => choice !== option.default)
    .map((choice) => ({ name: `${option.key}:${String(choice)}`, options: { [option.key]: choice } as CtOptionValues })));

const VERIFY_OPTION_SETS: readonly VerifyOptionSet[] = [
  { name: 'default', options: {} },
  ...modeSets,
  ...flippedSets,
  ...choiceSets,
];

export { VERIFY_OPTION_SETS };
