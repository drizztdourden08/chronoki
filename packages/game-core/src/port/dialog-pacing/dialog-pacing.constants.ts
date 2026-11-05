/* @layer bridge-wasm @kind constants */
import type { CkDialogPacing } from './dialog-pacing.type';

const DIALOG_SPEED_STOPS = [0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 0] as const;
const DIALOG_HOLD_STOPS = [1.5, 2, 2.5, 3, 4] as const;
const INSTANT_SPEED = 0;
const ORIGINAL_SPEED = 1;
const Q4_STEPS_PER_UNIT = 4;

const DIALOG_NEUTRAL_PACING: CkDialogPacing = { baseQ4: 4, holdQ4: 4, hold: false, fill: false, autoSkip: false };

export { DIALOG_HOLD_STOPS, DIALOG_NEUTRAL_PACING, DIALOG_SPEED_STOPS, INSTANT_SPEED, ORIGINAL_SPEED, Q4_STEPS_PER_UNIT };
