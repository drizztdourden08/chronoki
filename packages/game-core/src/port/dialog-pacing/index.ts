/* @layer bridge-wasm @kind barrel */
export {
  DIALOG_HOLD_STOPS, DIALOG_NEUTRAL_PACING, DIALOG_SPEED_STOPS, INSTANT_SPEED, ORIGINAL_SPEED, Q4_STEPS_PER_UNIT,
} from './dialog-pacing.constants';
export { dialogPacingOf } from './dialog-pacing-of';
export { formatDialogSpeed } from './format-dialog-speed';
export { nearestStop } from './nearest-stop';
export { toQ4 } from './to-q4';
export type { CkDialogPacing, DialogPacingSettings } from './dialog-pacing.type';
