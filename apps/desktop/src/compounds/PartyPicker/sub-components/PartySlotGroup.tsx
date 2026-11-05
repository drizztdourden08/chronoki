/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { PartySlotGroupProps } from '../PartyPicker.type';
import { PARTY_CHARACTER_NAMES, PARTY_PICKER_LABELS } from '../PartyPicker.constants';

const rowText = (id: PartySlotGroupProps['members'][number], index: number): string =>
  `${index + 1} · ${PARTY_CHARACTER_NAMES[id]}${index === 0 ? ` ${PARTY_PICKER_LABELS.lead}` : ''}`;

const PartySlotGroup = ({ title, members, offset }: PartySlotGroupProps) =>
  members.length === 0 ? null : (
    <Box className="party-slots__group">
      <Text className="party-slots__title">{title}</Text>
      {members.map((id, i) => <Text key={id}>{rowText(id, offset + i)}</Text>)}
    </Box>
  );

export { PartySlotGroup };
