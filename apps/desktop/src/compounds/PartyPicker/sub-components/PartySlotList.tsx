/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { CtCharacter } from '@chronoki/game-core';
import { PARTY_ACTIVE_SLOTS, PARTY_PICKER_LABELS } from '../PartyPicker.constants';
import { PartySlotGroup } from './PartySlotGroup';

const PartySlotList = ({ value }: { value: readonly CtCharacter[] }) => (
  <Box className="party-slots">
    <PartySlotGroup title={PARTY_PICKER_LABELS.active} members={value.slice(0, PARTY_ACTIVE_SLOTS)} offset={0} />
    <PartySlotGroup title={PARTY_PICKER_LABELS.reserve} members={value.slice(PARTY_ACTIVE_SLOTS)} offset={PARTY_ACTIVE_SLOTS} />
    <Text className="party-slots__note">{PARTY_PICKER_LABELS.note}</Text>
  </Box>
);

export { PartySlotList };
