/* @layer renderer-components @kind constants */
import type { HintAction } from './SaveStateOverlay.type';

const ANIM_MS = 180;

const HINT_LABELS: Record<HintAction, string> = {
  'tap-load': 'Tap to load',
  'hold-save': 'Hold to save',
  'holding-save': 'Saving...',
  'esc-cancel': 'Cancel',
};

const IDLE_HINTS: readonly HintAction[] = ['tap-load', 'hold-save', 'esc-cancel'];

const HOLDING_HINTS: readonly HintAction[] = ['holding-save', 'esc-cancel'];

export { ANIM_MS, HINT_LABELS, HOLDING_HINTS, IDLE_HINTS };
