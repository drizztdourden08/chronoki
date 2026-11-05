/* @layer bridge-wasm @kind types */
interface CkDialogPacing {
  baseQ4: number;
  holdQ4: number;
  hold: boolean;
  fill: boolean;
  autoSkip: boolean;
}

interface DialogPacingSettings {
  dialogSpeed: number;
  dialogHoldSpeed: number;
  dialogHoldToAccelerate: boolean;
  dialogFillOnB: boolean;
  dialogAutoSkip: boolean;
}

export type { CkDialogPacing, DialogPacingSettings };
