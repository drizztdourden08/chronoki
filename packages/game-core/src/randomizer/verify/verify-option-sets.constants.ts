/* @layer bridge-wasm @kind constants */
import { CT_OPTION_CATALOG } from '../world/ct-options.constants';
import { CT_MODES } from '../world/modes/ct-modes.constants';
import type { VerifyOptionSet } from './verify-option-set.type';

const SKIPPED_KEYS: readonly string[] = ['gameMode', 'partyMode', 'partySize', 'startingParty', 'objectiveCount', 'objectivesNeeded'];

const implementedOptions = CT_OPTION_CATALOG.filter((option) => option.implemented && !SKIPPED_KEYS.includes(option.key));

const modeSets: VerifyOptionSet[] = CT_MODES.filter((mode) => mode.implemented)
  .map((mode) => ({ name: `mode:${mode.id}`, options: { gameMode: mode.id } }));

const flippedSets: VerifyOptionSet[] = implementedOptions
  .filter((option) => typeof option.default === 'boolean')
  .map((option) => ({ name: `flip:${option.key}`, options: { [option.key]: !option.default } }));

const choiceSets: VerifyOptionSet[] = implementedOptions
  .flatMap((option) => (option.choices ?? [])
    .filter((choice) => choice !== option.default)
    .map((choice) => ({ name: `${option.key}:${String(choice)}`, options: { [option.key]: choice } })));

const epochFailImplemented = CT_OPTION_CATALOG.some((option) => option.key === 'epochFail' && option.implemented);

const crossSets: VerifyOptionSet[] = epochFailImplemented
  ? [{ name: 'cross:epochFail+pendant+magic', options: { epochFail: true, earlyPendantCharge: true, unlockedMagic: true } }]
  : [];

const bucketSets: VerifyOptionSet[] = CT_OPTION_CATALOG.some((option) => option.key === 'bucketList' && option.implemented)
  ? [{ name: 'cross:bucketList-all', options: { bucketList: true, objectiveCount: 8, objectivesNeeded: 8 } }]
  : [];

const duplicateSets: VerifyOptionSet[] = ['characterRando', 'duplicateCharacters']
  .every((key) => CT_OPTION_CATALOG.some((option) => option.key === key && option.implemented))
  ? [{ name: 'cross:characterRando+duplicateCharacters', options: { characterRando: true, duplicateCharacters: true } }]
  : [];

const VERIFY_OPTION_SETS: readonly VerifyOptionSet[] = [
  { name: 'default', options: {} },
  ...modeSets,
  ...flippedSets,
  ...choiceSets,
  ...crossSets,
  ...bucketSets,
  ...duplicateSets,
];

export { VERIFY_OPTION_SETS };
