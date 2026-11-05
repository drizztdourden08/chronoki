/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { OptionGroupList } from '@drizztdourden08/brock-randomizer/renderer';
import type { OptionTabProps } from '@drizztdourden08/brock-randomizer';
import { PartyPicker, usePartySprites } from '../../../compounds/PartyPicker';
import { partyGroupsOf } from './party-groups-of';
import { partyOfValue } from './party-of-value';

const PartyTab = ({ values, overrides, onChange, frozen }: OptionTabProps) => {
  const spriteUrlOf = usePartySprites(null);
  const picked = partyOfValue(values.startingParty);
  const custom = values.partyMode === 'custom';
  const set = (key: string, value: unknown) => onChange?.({ ...overrides, [key]: value });
  const setMode = (next: unknown) => onChange?.({ ...overrides, partyMode: next, ...(next === 'custom' && picked.length === 0 ? { startingParty: 'crono' } : {}) });
  return (
    <Box>
      <OptionGroupList
        groups={partyGroupsOf(custom)}
        valueOf={(option) => values[option.key] ?? ''}
        frozen={frozen}
        live
        onRowChange={onChange === undefined ? undefined : (key, next) => (key === 'partyMode' ? setMode(next) : set(key, next))}
      />
      {custom && (
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
