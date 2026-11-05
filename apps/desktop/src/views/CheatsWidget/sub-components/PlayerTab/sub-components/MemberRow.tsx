/* @layer renderer-widgets @kind component */
import { NumberSetter } from '@drizztdourden08/brock-react';
import { Button, Inline, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { STAT_CAPS } from '@chronoki/game-core';
import type { SheetStat } from '@chronoki/game-core';
import { cheatRefill, cheatSetStat } from '@app/game/cheats';
import { usePopoverAnchor } from '../../../behavior/usePopoverAnchor';
import { STAT_LABELS, STAT_ORDER, STAT_STEPS } from '../PlayerTab.constants';
import type { MemberRowProps } from '../PlayerTab.type';

const MemberRow = ({ sheet, onResult }: MemberRowProps) => {
  const { open, show, close } = usePopoverAnchor<SheetStat>();
  const values: Record<SheetStat, number> = { hp: sheet.hp, maxHp: sheet.maxHp, mp: sheet.mp, maxMp: sheet.maxMp };
  const stat = open?.kind;

  return (
    <Stack gap="sm">
      <Inline gap="sm" justify="between" align="center">
        <Text>{sheet.name ?? `Character ${sheet.id}`} Lv {sheet.level}</Text>
        <Button size="sm" onClick={() => onResult(cheatRefill([sheet.id]))}>Refill</Button>
      </Inline>
      <Inline gap="sm" wrap>
        {STAT_ORDER.map((key) => (
          <Button key={key} size="sm" onClick={show(key)}>{STAT_LABELS[key]} {values[key]}</Button>
        ))}
      </Inline>
      {open && stat ? (
        <NumberSetter
          title={`${sheet.name ?? sheet.id} ${STAT_LABELS[stat]}`}
          value={values[stat]}
          min={0}
          max={STAT_CAPS[stat]}
          steps={STAT_STEPS}
          anchor={open.anchor}
          onCommit={(value) => onResult(cheatSetStat(sheet.id, stat, value))}
          onClose={close}
        />
      ) : null}
    </Stack>
  );
};

export { MemberRow };
