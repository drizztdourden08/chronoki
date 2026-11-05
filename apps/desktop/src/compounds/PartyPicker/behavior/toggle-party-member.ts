/* @layer renderer-components @kind logic */
import type { CtCharacter } from '@chronoki/game-core';

const toggleMember = (party: readonly CtCharacter[], id: CtCharacter): readonly CtCharacter[] =>
  party.includes(id) ? party.filter((member) => member !== id) : [...party, id];

export { toggleMember };
