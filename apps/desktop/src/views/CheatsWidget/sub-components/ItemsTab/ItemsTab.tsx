/* @layer renderer-widgets @kind component */
import { useState } from 'react';
import { ChoicePopover, ControlLegend, NumberSetter, usePointerHintTarget } from '@drizztdourden08/brock-react';
import type { ChoiceOption } from '@drizztdourden08/brock-react';
import { Box, Button, Callout, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ITEM_ID_MAX } from '@chronoki/game-core';
import { cheatGiveItem, cheatItemName } from '@app/game/cheats';
import { usePopoverAnchor } from '../../behavior/usePopoverAnchor';
import { useWriteNotice } from '../../behavior/useWriteNotice';
import { LEGEND_ITEMS, OPEN_HINT, WRITE_REFUSED_TEXT } from '../../CheatsWidget.constants';
import { DEFAULT_ITEM_ID, GIVE_COUNTS, ITEM_ID_STEPS } from './ItemsTab.constants';

const ItemsTab = () => {
  const [itemId, setItemId] = useState(DEFAULT_ITEM_ID);
  const { open, show, close } = usePopoverAnchor<'id' | 'give'>();
  const { refused, settle } = useWriteNotice();
  const giveHint = usePointerHintTarget('Give item', OPEN_HINT);
  const name = cheatItemName(itemId) || 'Unknown id';
  const options: ChoiceOption[] = GIVE_COUNTS.map((count) => ({
    key: String(count), label: `Give ${count}`, tone: 'give', onPick: () => settle(cheatGiveItem(itemId, count)),
  }));

  return (
    <Box className="cheats-tab">
      <Stack gap="md">
        {refused ? <Callout tone="warning">{WRITE_REFUSED_TEXT}</Callout> : null}
        <Button onClick={show('id')}>Item {itemId}</Button>
        <Text>{name}</Text>
        <Button onClick={show('give')} {...giveHint}>Give</Button>
        <ControlLegend items={LEGEND_ITEMS} />
      </Stack>
      {open?.kind === 'id' ? (
        <NumberSetter title="Item id" value={itemId} min={1} max={ITEM_ID_MAX} steps={ITEM_ID_STEPS} anchor={open.anchor} onCommit={setItemId} onClose={close} />
      ) : null}
      {open?.kind === 'give' ? <ChoicePopover title={name} options={options} anchor={open.anchor} onClose={close} /> : null}
    </Box>
  );
};

export { ItemsTab };
