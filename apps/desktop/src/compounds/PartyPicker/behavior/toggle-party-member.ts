/* @layer renderer-components @kind logic */
import type { CtCharacter } from '@chronoki/game-core';

const withoutMember = (party: readonly CtCharacter[], id: CtCharacter): readonly CtCharacter[] =>
  party.length === 1 ? party : party.filter((member) => member !== id);

const toggleMember = (party: readonly CtCharacter[], id: CtCharacter): readonly CtCharacter[] =>
  party.includes(id) ? withoutMember(party, id) : [...party, id];

export { toggleMember };
