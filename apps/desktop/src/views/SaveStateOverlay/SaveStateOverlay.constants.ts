/* @layer renderer-components @kind constants */
import { QUICK_SAVE_SLOTS } from '@app/game/save-slots';
import { loadFromSlot, saveToSlot } from '@app/views/GameSession';
import type { HintAction, SlotActionSpec } from './SaveStateOverlay.type';

const SLOT_COUNT = QUICK_SAVE_SLOTS;
const ANIM_MS = 180;
const TAP_THRESHOLD_MS = 180;

const SLOT_ACTIONS: readonly SlotActionSpec[] = [
  { prefix: 'load-state', label: 'LoadState', verb: 'Loading', run: loadFromSlot },
  { prefix: 'save-state', label: 'SaveState', verb: 'Saving', run: saveToSlot },
];

const HINT_LABELS: Record<HintAction, string> = {
  'tap-load': 'Tap to load',
  'hold-save': 'Hold to save',
  'holding-save': 'Saving...',
  'esc-cancel': 'Cancel',
};

export { HINT_LABELS, SLOT_COUNT, ANIM_MS, TAP_THRESHOLD_MS, SLOT_ACTIONS };
