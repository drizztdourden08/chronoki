/* @layer renderer-widgets @kind component */
import { ControlLegend, NumberSetter } from '@drizztdourden08/brock-react';
import { Box, Button, Callout, Stack } from '@drizztdourden08/tessera/primitives';
import { cheatRefill, cheatSetGold } from '@app/game/cheats';
import { usePopoverAnchor } from '../../behavior/usePopoverAnchor';
import { useWriteNotice } from '../../behavior/useWriteNotice';
import { LEGEND_ITEMS, WRITE_REFUSED_TEXT } from '../../CheatsWidget.constants';
import { GOLD_CAP, GOLD_STEPS } from './PlayerTab.constants';
import type { PlayerTabProps } from './PlayerTab.type';
import { MemberRow } from './sub-components/MemberRow';

const PlayerTab = ({ snapshot }: PlayerTabProps) => {
  const { open, show, close } = usePopoverAnchor<'gold'>();
  const { refused, settle } = useWriteNotice();
  const joined = snapshot.party.sheets.filter((sheet) => (snapshot.party.joinedMask >> sheet.id) & 1);

  return (
    <Box className="cheats-tab">
      <Stack gap="md">
        {refused ? <Callout tone="warning">{WRITE_REFUSED_TEXT}</Callout> : null}
        <Button onClick={show('gold')}>Gold {snapshot.gold}</Button>
        <Button onClick={() => settle(cheatRefill(joined.map((sheet) => sheet.id)))}>Refill everyone's HP and MP</Button>
        {joined.map((sheet) => <MemberRow key={sheet.id} sheet={sheet} onResult={settle} />)}
        <ControlLegend items={LEGEND_ITEMS} />
      </Stack>
      {open ? (
        <NumberSetter
          title="Gold"
          value={snapshot.gold}
          min={0}
          max={GOLD_CAP}
          steps={GOLD_STEPS}
          anchor={open.anchor}
          onCommit={(value) => settle(cheatSetGold(value))}
          onClose={close}
        />
      ) : null}
    </Box>
  );
};

export { PlayerTab };
