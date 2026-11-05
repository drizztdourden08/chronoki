/* @layer bridge-wasm @kind types */
interface CkDialogPacing {
  baseQ4: number;
  holdQ4: number;
  hold: boolean;
  fill: boolean;
}

interface DialogPacingSettings {
  dialogSpeed: number;
  dialogHoldSpeed: number;
  dialogHoldToAccelerate: boolean;
  dialogFillOnB: boolean;
}

export type { CkDialogPacing, DialogPacingSettings };
