/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { CtCharacter } from '@chronoki/game-core';
import { PARTY_ACTIVE_SLOTS, PARTY_CHARACTER_NAMES, PARTY_PICKER_LABELS } from '../PartyPicker.constants';

const rowText = (id: CtCharacter, index: number): string =>
  `${index + 1} · ${PARTY_CHARACTER_NAMES[id]}${index === 0 ? ` ${PARTY_PICKER_LABELS.lead}` : ''}`;

const SlotGroup = ({ title, members, offset }: { title: string; members: readonly CtCharacter[]; offset: number }) =>
  members.length === 0 ? null : (
    <Box className="party-slots__group">
      <Text className="party-slots__title">{title}</Text>
      {members.map((id, i) => <Text key={id}>{rowText(id, offset + i)}</Text>)}
    </Box>
  );

const PartySlotList = ({ value }: { value: readonly CtCharacter[] }) => (
  <Box className="party-slots">
    <SlotGroup title={PARTY_PICKER_LABELS.active} members={value.slice(0, PARTY_ACTIVE_SLOTS)} offset={0} />
    <SlotGroup title={PARTY_PICKER_LABELS.reserve} members={value.slice(PARTY_ACTIVE_SLOTS)} offset={PARTY_ACTIVE_SLOTS} />
    <Text className="party-slots__note">{PARTY_PICKER_LABELS.note}</Text>
  </Box>
);

export { PartySlotList };
