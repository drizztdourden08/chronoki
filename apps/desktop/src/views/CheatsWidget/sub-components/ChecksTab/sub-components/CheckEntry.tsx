/* @layer renderer-widgets @kind component */
import { usePointerHintTarget } from '@drizztdourden08/brock-react';
import { Button, Inline, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { cheatCollectCheck } from '@app/game/cheats';
import { COLLECT_HINT } from '../ChecksTab.constants';
import type { CheckEntryProps } from '../ChecksTab.type';

const CheckEntry = ({ row, onResult }: CheckEntryProps) => {
  const hint = usePointerHintTarget('Collect', COLLECT_HINT);
  return (
    <Inline gap="sm" justify="between" align="center">
      <Stack gap="xs">
        <Text>{row.name}</Text>
        <Text size="sm">{row.item}</Text>
      </Stack>
      {row.done ? <Text size="sm">Done</Text> : <Button size="sm" onClick={() => onResult(cheatCollectCheck(row.id))} {...hint}>Collect</Button>}
    </Inline>
  );
};

export { CheckEntry };
