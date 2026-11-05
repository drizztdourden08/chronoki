/* @layer bridge-wasm @kind logic */
import type { CtCharacter } from '@chronoki/game-core';
import { CT_CHARACTERS } from '@chronoki/game-core';

const partyOfValue = (value: unknown): readonly CtCharacter[] =>
  typeof value === 'string'
    ? value.split(',').filter((id, i, all): id is CtCharacter => (CT_CHARACTERS as readonly string[]).includes(id) && all.indexOf(id) === i)
    : [];

export { partyOfValue };
