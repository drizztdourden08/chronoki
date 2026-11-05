/* @layer renderer-components @kind component */
import { Box, SegmentedControl } from '@drizztdourden08/tessera/primitives';
import type { OptionTabProps } from '@drizztdourden08/brock-randomizer';
import { PartyPicker, usePartySprites } from '../../../compounds/PartyPicker';
import { PARTY_MODE_OPTIONS, PARTY_SIZE_OPTIONS, PARTY_TAB_LABELS } from './party-tab.constants';
import { partyOfValue } from './party-of-value';

const PartyTab = ({ values, overrides, onChange, frozen }: OptionTabProps) => {
  const spriteUrlOf = usePartySprites(null);
  const set = (key: string, value: unknown) => onChange?.({ ...overrides, [key]: value });
  const setMode = (next: string) => onChange?.({ ...overrides, partyMode: next, ...(next === 'custom' && partyOfValue(values.startingParty).length === 0 ? { startingParty: 'crono' } : {}) });
  const picked = partyOfValue(values.startingParty);
  const mode = values.partyMode === 'custom' ? 'custom' : 'random';
  return (
    <Box>
      <SegmentedControl
        label={PARTY_TAB_LABELS.mode}
        value={mode}
        options={PARTY_MODE_OPTIONS}
        disabled={frozen}
        onChange={setMode}
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
          value={picked}
          frozen={frozen}
          spriteUrlOf={spriteUrlOf}
          onChange={(next) => next.length > 0 && set('startingParty', next.join(','))}
        />
      )}
    </Box>
  );
};

export { PartyTab };
