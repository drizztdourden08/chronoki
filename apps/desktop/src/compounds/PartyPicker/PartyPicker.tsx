/* @layer renderer-components @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { CT_CHARACTERS } from '@chronoki/game-core';
import './PartyPicker.css';
import { usePartySelection } from './behavior/usePartySelection';
import { PARTY_PICKER_LABELS } from './PartyPicker.constants';
import type { PartyPickerProps } from './PartyPicker.type';
import { PartySlotList } from './sub-components/PartySlotList';
import { PartyTile } from './sub-components/PartyTile';

const PartyPicker = ({ value, onChange, frozen = false, spriteUrlOf }: PartyPickerProps) => {
  const { toggle, clear } = usePartySelection(value, onChange);
  return (
    <Box className="party-picker">
      <Text className="party-picker__hint">{PARTY_PICKER_LABELS.hint}</Text>
      <Box className="party-picker__tiles">
        {CT_CHARACTERS.map((id) => (
          <PartyTile key={id} id={id} slot={value.indexOf(id)} disabled={frozen} spriteUrl={spriteUrlOf?.(id) ?? null} onToggle={toggle} />
        ))}
      </Box>
      <Box className="party-picker__bar">
        <Button size="sm" disabled={frozen || value.length === 0} onClick={clear}>{PARTY_PICKER_LABELS.clear}</Button>
        <Text className="party-picker__count">{`Picked ${value.length} of ${CT_CHARACTERS.length}`}</Text>
      </Box>
      <PartySlotList value={value} />
    </Box>
  );
};

export { PartyPicker };
