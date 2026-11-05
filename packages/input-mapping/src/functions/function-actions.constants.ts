/* @layer shared-input @kind constants */
import type { BaseFunctionAction, FunctionAction, FunctionMapping } from './function-mapping.type';
import { LOAD_SLOT_ACTIONS, SAVE_SLOT_ACTIONS, SLOT_DEFAULT_MAPPINGS, SLOT_FUNCTION_LABELS } from './function-slots.constants';

const BASE_ACTIONS: readonly BaseFunctionAction[] = [
  'save-state',
  'load-state',
  'slot-next',
  'slot-prev',
  'turbo',
  'menu',
  'screenshot',
  'pause',
  'reset',
  'fullscreen',
  'toggle-debug-capture',
  'profile-prev',
  'profile-next',
];

const FUNCTION_ACTIONS: readonly FunctionAction[] = [...BASE_ACTIONS, ...SAVE_SLOT_ACTIONS, ...LOAD_SLOT_ACTIONS];

const FUNCTION_ACTION_LABELS: Record<FunctionAction, string> = {
  'save-state': 'Save State',
  'load-state': 'Load State',
  'slot-next': 'Next Save Slot',
  'slot-prev': 'Previous Save Slot',
  turbo: 'Turbo',
  menu: 'Menu',
  screenshot: 'Screenshot',
  pause: 'Pause',
  reset: 'Reset',
  fullscreen: 'Fullscreen',
  'toggle-debug-capture': 'Toggle Debug Capture',
  'profile-prev': 'Previous Input Profile',
  'profile-next': 'Next Input Profile',
  ...SLOT_FUNCTION_LABELS,
};

const DEFAULT_FUNCTION_MAPPINGS: FunctionMapping[] = [
  { action: 'save-state', binding: { type: 'none' }, icon: null },
  { action: 'load-state', binding: { type: 'none' }, icon: null },
  { action: 'slot-next', binding: { type: 'none' }, icon: null },
  { action: 'slot-prev', binding: { type: 'none' }, icon: null },
  { action: 'turbo', binding: { type: 'none' }, icon: null },
  { action: 'menu', binding: { type: 'keyboard', code: 'Escape' }, icon: null },
  { action: 'screenshot', binding: { type: 'keyboard', code: 'F12' }, icon: null },
  { action: 'pause', binding: { type: 'none' }, icon: null },
  { action: 'reset', binding: { type: 'keyboard', code: 'Backspace', modifiers: { ctrl: true } }, icon: null },
  { action: 'fullscreen', binding: { type: 'keyboard', code: 'F11' }, icon: null },
  { action: 'toggle-debug-capture', binding: { type: 'keyboard', code: 'Tab' }, icon: null },
  { action: 'profile-prev', binding: { type: 'none' }, icon: null },
  { action: 'profile-next', binding: { type: 'none' }, icon: null },
  ...SLOT_DEFAULT_MAPPINGS,
];

export { DEFAULT_FUNCTION_MAPPINGS, FUNCTION_ACTIONS, FUNCTION_ACTION_LABELS };
