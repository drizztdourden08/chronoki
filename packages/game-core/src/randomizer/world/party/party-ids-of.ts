/* @layer bridge-wasm @kind logic */
import { CT_CHARACTERS } from './ct-party.constants';
import type { CtStartParty } from './ct-party.type';

const partyIdsOf = (party: CtStartParty): number[] => party.map((character) => CT_CHARACTERS.indexOf(character));

export { partyIdsOf };
