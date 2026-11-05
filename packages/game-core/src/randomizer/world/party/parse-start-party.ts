/* @layer bridge-wasm @kind logic */
import type { CtCharacter } from '../ct-world-keys.type';
import { CT_CHARACTERS, PARTY_MAX_SIZE, PARTY_MIN_SIZE } from './ct-party.constants';
import type { CtStartParty } from './ct-party.type';

const isCharacter = (id: string): id is CtCharacter => (CT_CHARACTERS as readonly string[]).includes(id);

const parseStartParty = (value: unknown): CtStartParty => {
  if (typeof value !== 'string') throw new Error('startingParty must be a comma-separated list of character ids');
  const ids = value.split(',').map((id) => id.trim()).filter((id) => id !== '');
  if (ids.length < PARTY_MIN_SIZE || ids.length > PARTY_MAX_SIZE) {
    throw new Error(`startingParty needs ${PARTY_MIN_SIZE} to ${PARTY_MAX_SIZE} characters, got ${ids.length}`);
  }
  const party = ids.map((id) => {
    if (!isCharacter(id)) throw new Error(`startingParty has an unknown character: ${id}`);
    return id;
  });
  if (new Set(party).size !== party.length) throw new Error('startingParty has a duplicate character');
  return party;
};

export { parseStartParty };
