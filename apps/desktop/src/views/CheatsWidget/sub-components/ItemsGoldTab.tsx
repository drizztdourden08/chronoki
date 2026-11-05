/* @layer renderer-widgets @kind component */
import { useState } from 'react';
import { Button, Callout, Field, NumberInput, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ITEM_ID_MAX, ITEM_STACK_MAX } from '@chronoki/game-core';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import { cheatGiveItem, cheatItemName, cheatSetGold } from '@app/game/cheats';
import { GOLD_CAP } from './ItemsGoldTab.constants';
import { DEFAULT_COUNT, DEFAULT_ITEM_ID, WRITE_REFUSED_TEXT } from '../CheatsWidget.constants';

const ItemsGoldTab = ({ snapshot }: { snapshot: GameInfoSnapshot }) => {
  const [itemId, setItemId] = useState(DEFAULT_ITEM_ID);
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [gold, setGold] = useState(snapshot.gold);
  const [refused, setRefused] = useState(false);
  const run = (applied: boolean): void => setRefused(!applied);
  const name = cheatItemName(itemId);

  return (
    <Stack gap="md">
      {refused ? <Callout tone="warning">{WRITE_REFUSED_TEXT}</Callout> : null}
      <Field label="Item id" hint={name || 'Unknown id'}>
        <NumberInput value={itemId} min={1} max={ITEM_ID_MAX} onChange={setItemId} />
      </Field>
      <Field label="Count">
        <NumberInput value={count} min={1} max={ITEM_STACK_MAX} onChange={setCount} />
      </Field>
      <Button onClick={() => run(cheatGiveItem(itemId, count))}>Give item</Button>
      <Field label="Gold" hint={<Text size="md">Now: {snapshot.gold}</Text>}>
        <NumberInput value={gold} min={0} max={GOLD_CAP} onChange={setGold} />
      </Field>
      <Button onClick={() => run(cheatSetGold(gold))}>Set gold</Button>
    </Stack>
  );
};

export { ItemsGoldTab };
