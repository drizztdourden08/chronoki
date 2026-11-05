/* @layer renderer-components @kind logic */
import type { SpriteTileItem } from '@drizztdourden08/brock-randomizer/renderer';
import type { CtCharacter } from '@chronoki/game-core';
import { CT_CHARACTERS } from '@chronoki/game-core';
import { PARTY_CHARACTER_NAMES } from '../PartyPicker.constants';

const partyTileItems = (
  value: readonly CtCharacter[],
  spriteUrlOf?: (id: CtCharacter) => string | null,
): readonly SpriteTileItem[] =>
  CT_CHARACTERS.map((id) => ({
    id,
    name: PARTY_CHARACTER_NAMES[id],
    sprite: spriteUrlOf?.(id) ?? undefined,
    checked: value.includes(id),
  }));

export { partyTileItems };
