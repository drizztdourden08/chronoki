/* @layer renderer-appshell @kind logic */
import { isHolding } from '@app/game/save-overlay';
import { pressSaveKey } from './press-save-key';
import { selected } from './selected-slot';

const pressSlotKey = (slotNumber: number): void => {
  if (isHolding()) return;
  selected.slot = slotNumber - 1;
  pressSaveKey();
};

export { pressSlotKey };
