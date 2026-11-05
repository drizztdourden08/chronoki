/* @layer renderer-app @kind config */
import { DIALOG_HOLD_STOPS, DIALOG_SPEED_STOPS, formatDialogSpeed } from '@chronoki/game-core';

const optionOf = (stop: number) => ({ value: String(stop), label: formatDialogSpeed(stop) });

const DIALOG_SPEED_OPTIONS = DIALOG_SPEED_STOPS.map(optionOf);
const DIALOG_HOLD_SPEED_OPTIONS = DIALOG_HOLD_STOPS.map(optionOf);

export { DIALOG_HOLD_SPEED_OPTIONS, DIALOG_SPEED_OPTIONS };
