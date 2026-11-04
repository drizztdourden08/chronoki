/* @layer renderer-components @kind logic */
import { FUNCTION_ACTION_LABELS, SNES_BUTTON_LABELS } from '@chronoki/input-mapping';
import type { ListeningTarget } from './controls.type';

const listeningLabel = (target: ListeningTarget): string =>
  target.type === 'snes' ? SNES_BUTTON_LABELS[target.button] : FUNCTION_ACTION_LABELS[target.action];

export { listeningLabel };
