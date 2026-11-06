/* @layer tests @kind constants */
import type { CtOptionValues } from '@chronoki/game-core';

interface CtShapeCase { name: string; seed: string; options: CtOptionValues }

const ALL_SEVEN = 'crono,marle,lucca,robo,frog,ayla,magus';

const caseOf = (name: string, options: CtOptionValues): CtShapeCase => ({ name, seed: `golden-${name}`, options });

const CT_SHAPE_CASES: readonly CtShapeCase[] = [
  { name: 'standard', seed: 'golden-standard', options: { gameMode: 'standard' } },
  { name: 'standard-epoch-fail', seed: 'golden-epoch-fail', options: { gameMode: 'standard', epochFail: true } },
  { name: 'lost-worlds', seed: 'golden-lost-worlds', options: { gameMode: 'lost-worlds' } },
  { name: 'legacy-of-cyrus', seed: 'golden-legacy-of-cyrus', options: { gameMode: 'legacy-of-cyrus' } },
  { name: 'ice-age', seed: 'golden-ice-age', options: { gameMode: 'ice-age' } },
  { name: 'vanilla-rando', seed: 'golden-vanilla-rando', options: { gameMode: 'vanilla-rando' } },
];

const CT_ORACLE_PENDING_CASES: readonly CtShapeCase[] = [
  caseOf('character-rando', { characterRando: true }),
  caseOf('character-rando-duplicates', { characterRando: true, duplicateCharacters: true }),
  caseOf('bucket-list', { bucketList: true }),
  caseOf('custom-party', { partyMode: 'custom', startingParty: 'crono,marle,lucca' }),
];

const CT_SHAPE_PENDING_CASES: readonly CtShapeCase[] = [
  ...CT_ORACLE_PENDING_CASES,
  caseOf('custom-party-1', { partyMode: 'custom', startingParty: 'crono' }),
  caseOf('custom-party-7', { partyMode: 'custom', startingParty: ALL_SEVEN }),
  caseOf('locked-characters', { lockedCharacters: true }),
];

export { CT_ORACLE_PENDING_CASES, CT_SHAPE_CASES, CT_SHAPE_PENDING_CASES };
export type { CtShapeCase };
