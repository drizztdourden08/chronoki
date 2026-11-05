/* @layer bridge-wasm @kind logic */
import type { CkDialogPacing, DialogPacingSettings } from './dialog-pacing.type';
import { toQ4 } from './to-q4';

const dialogPacingOf = (settings: DialogPacingSettings): CkDialogPacing => ({
  baseQ4: toQ4(settings.dialogSpeed),
  holdQ4: toQ4(settings.dialogHoldSpeed),
  hold: settings.dialogHoldToAccelerate,
  fill: settings.dialogFillOnB,
  autoSkip: settings.dialogAutoSkip,
});

export { dialogPacingOf };
