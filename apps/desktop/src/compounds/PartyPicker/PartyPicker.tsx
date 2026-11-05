/* @layer renderer-components @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { SpriteTileSet } from '@drizztdourden08/brock-randomizer/renderer';
import type { CtCharacter } from '@chronoki/game-core';
import { CT_CHARACTERS } from '@chronoki/game-core';
import './PartyPicker.css';
import { partyTileItems } from './behavior/party-tile-items';
import { usePartySelection } from './behavior/usePartySelection';
import { PARTY_PICKER_LABELS } from './PartyPicker.constants';
import type { PartyPickerProps } from './PartyPicker.type';
import { PartySlotList } from './sub-components/PartySlotList';

const PartyPicker = ({ value, onChange, frozen = false, spriteUrlOf }: PartyPickerProps) => {
  const { toggle, clear } = usePartySelection(value, onChange);
  return (
    <Box className="party-picker">
      <Text className="party-picker__hint">{PARTY_PICKER_LABELS.hint}</Text>
      <SpriteTileSet
        items={partyTileItems(value, spriteUrlOf)}
        order={value}
        disabled={frozen}
        onChange={(id) => toggle(id as CtCharacter)}
      />
      <Box className="party-picker__bar">
        <Button size="sm" disabled={frozen || value.length <= 1} onClick={clear}>{PARTY_PICKER_LABELS.clear}</Button>
        <Text className="party-picker__count">{`Picked ${value.length} of ${CT_CHARACTERS.length}`}</Text>
      </Box>
      <PartySlotList value={value} />
    </Box>
  );
};

export { PartyPicker };
