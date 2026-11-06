/* @layer renderer-widgets @kind component */
import { useMemo, useState } from 'react';
import { ControlLegend } from '@drizztdourden08/brock-react';
import { Box, Callout, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { useWriteNotice } from '../../behavior/useWriteNotice';
import { LEGEND_ITEMS, WRITE_REFUSED_TEXT } from '../../CheatsWidget.constants';
import { NO_MATCH_TEXT, SEARCH_PLACEHOLDER } from './ChecksTab.constants';
import type { ChecksTabProps } from './ChecksTab.type';
import { CheckEntry } from './sub-components/CheckEntry';

const ChecksTab = ({ rows }: ChecksTabProps) => {
  const [search, setSearch] = useState('');
  const { refused, settle } = useWriteNotice();
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? rows.filter((row) => `${row.name} ${row.item}`.toLowerCase().includes(q)) : rows;
  }, [rows, search]);

  return (
    <Box className="cheats-tab">
      <Stack gap="md">
        {refused ? <Callout tone="warning">{WRITE_REFUSED_TEXT}</Callout> : null}
        <TextInput type="text" placeholder={SEARCH_PLACEHOLDER} value={search} onChange={(e) => setSearch(e.target.value)} />
        {shown.length === 0 ? <Text>{NO_MATCH_TEXT}</Text> : null}
        {shown.map((row) => <CheckEntry key={row.id} row={row} onResult={settle} />)}
        <ControlLegend items={LEGEND_ITEMS} />
      </Stack>
    </Box>
  );
};

export { ChecksTab };
