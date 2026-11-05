/* @layer renderer-widgets @kind component */
import { useState } from 'react';
import { Button, Callout, Inline, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import { cheatRefill } from '@app/game/cheats';
import { WRITE_REFUSED_TEXT } from '../CheatsWidget.constants';

const PartyTab = ({ snapshot }: { snapshot: GameInfoSnapshot }) => {
  const [refused, setRefused] = useState(false);
  const joined = snapshot.party.sheets.filter((sheet) => (snapshot.party.joinedMask >> sheet.id) & 1);
  const refill = (ids: readonly number[]): void => setRefused(!cheatRefill(ids));

  return (
    <Stack gap="md">
      {refused ? <Callout tone="warning">{WRITE_REFUSED_TEXT}</Callout> : null}
      <Button onClick={() => refill(joined.map((sheet) => sheet.id))}>Refill everyone's HP and MP</Button>
      {joined.map((sheet) => (
        <Inline key={sheet.id} gap="sm" justify="between" align="center">
          <Text>{sheet.name ?? `Character ${sheet.id}`} Lv {sheet.level}: HP {sheet.hp}/{sheet.maxHp} MP {sheet.mp}/{sheet.maxMp}</Text>
          <Button size="sm" onClick={() => refill([sheet.id])}>Refill</Button>
        </Inline>
      ))}
    </Stack>
  );
};

export { PartyTab };
