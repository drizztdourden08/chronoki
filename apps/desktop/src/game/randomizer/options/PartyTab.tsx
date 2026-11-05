/* @layer renderer-components @kind component */
import { Box, SegmentedControl } from '@drizztdourden08/tessera/primitives';
import type { OptionTabProps } from '@drizztdourden08/brock-randomizer';
import { PartyPicker, usePartySprites } from '../../../compounds/PartyPicker';
import { PARTY_MODE_OPTIONS, PARTY_SIZE_OPTIONS, PARTY_TAB_LABELS } from './party-tab.constants';
import { partyOfValue } from './party-of-value';

const PartyTab = ({ values, overrides, onChange, frozen, romFile }: OptionTabProps) => {
  const spriteUrlOf = usePartySprites(romFile);
  const set = (key: string, value: unknown) => onChange?.({ ...overrides, [key]: value });
  const mode = values.partyMode === 'custom' ? 'custom' : 'random';
  return (
    <Box>
      <SegmentedControl
        label={PARTY_TAB_LABELS.mode}
        value={mode}
        options={PARTY_MODE_OPTIONS}
        disabled={frozen}
        onChange={(next) => set('partyMode', next)}
      />
      {mode === 'random' ? (
        <SegmentedControl
          label={PARTY_TAB_LABELS.size}
          description={PARTY_TAB_LABELS.sizeHint}
          value={String(values.partySize)}
          options={PARTY_SIZE_OPTIONS}
          disabled={frozen}
          onChange={(next) => set('partySize', Number(next))}
        />
      ) : (
        <PartyPicker
          value={partyOfValue(values.startingParty)}
          frozen={frozen}
          spriteUrlOf={spriteUrlOf}
          onChange={(next) => set('startingParty', next.join(','))}
        />
      )}
    </Box>
  );
};

export { PartyTab };
