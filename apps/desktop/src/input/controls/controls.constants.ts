/* @layer renderer-components @kind constants */
import { FUNCTION_ACTION_LABELS, SNES_BUTTONS, SNES_BUTTON_LABELS } from '@chronoki/input-mapping';
import type { FunctionAction, SnesButton } from '@chronoki/input-mapping';
import type { ActionDef, ControlsTabDef, ReservedRow } from '@drizztdourden08/brock-input/renderer';

const SHORTCUT_ACTIONS: readonly FunctionAction[] = [
  'save-state-1', 'save-state-2', 'save-state-3', 'save-state-4',
  'save-state-5', 'save-state-6', 'save-state-7', 'save-state-8',
  'save-state-9', 'save-state-10', 'save-state-11', 'save-state-12',
  'load-state-1', 'load-state-2', 'load-state-3', 'load-state-4',
  'load-state-5', 'load-state-6', 'load-state-7', 'load-state-8',
  'load-state-9', 'load-state-10', 'load-state-11', 'load-state-12',
  'save-state', 'load-state', 'slot-next', 'slot-prev',
  'pause', 'reset',
  'fullscreen', 'turbo',
  'profile-next', 'profile-prev',
  'toggle-debug-capture', 'screenshot',
];

const SNES_ACTION_LABELS: Record<SnesButton, string> = {
  A: 'Confirm / Talk', B: 'Cancel / Run', X: 'Menu', Y: 'Y Button', L: 'L Button', R: 'R Button',
  Start: 'Start Button', Select: 'Select Button',
  Up: 'Move Up', Down: 'Move Down', Left: 'Move Left', Right: 'Move Right',
};

const SNES_ICON_IDS: Record<SnesButton, string> = {
  A: 'snes-a', B: 'snes-b', X: 'snes-x', Y: 'snes-y', L: 'snes-l', R: 'snes-r',
  Start: 'snes-start', Select: 'snes-select',
  Up: 'snes-dup', Down: 'snes-ddown', Left: 'snes-dleft', Right: 'snes-dright',
};

const SNES_ACTION_DEFS: readonly ActionDef[] = SNES_BUTTONS.map((button) => ({
  id: button,
  label: SNES_ACTION_LABELS[button],
  middleLabel: SNES_BUTTON_LABELS[button],
  glyph: SNES_ICON_IDS[button],
}));

const SHORTCUT_ACTION_DEFS: readonly ActionDef[] = SHORTCUT_ACTIONS.map((action) => ({
  id: action,
  label: FUNCTION_ACTION_LABELS[action],
}));

const RESERVED_SHORTCUTS: readonly ReservedRow[] = [
  { label: 'Open Menu', bindingLabel: 'Esc', glyph: 'kb-escape' },
];

const CONTROLS_TABS: readonly ControlsTabDef[] = [
  {
    id: 'controls', label: 'Game Controls', kind: 'actions', scope: 'profile',
    actions: SNES_ACTION_DEFS, middleLabel: 'SNES', acceptsDeviceDrop: true,
  },
  {
    id: 'shortcuts', label: 'Shortcuts & Functions', kind: 'actions', scope: 'global',
    title: 'Keyboard Shortcuts', actions: SHORTCUT_ACTION_DEFS, reserved: RESERVED_SHORTCUTS,
  },
  { id: 'options', label: 'Options', kind: 'options' },
];

export { CONTROLS_TABS };
