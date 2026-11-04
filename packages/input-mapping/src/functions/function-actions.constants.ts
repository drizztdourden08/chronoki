/* @layer shared-input @kind constants */
import type { FunctionAction, FunctionMapping } from './function-mapping.type';

const FUNCTION_ACTIONS = [
  'save-state',
  'load-state',
  'slot-next',
  'slot-prev',
  'fast-forward',
  'menu',
  'screenshot',
  'pause',
  'profile-prev',
  'profile-next',
] as const;

const FUNCTION_ACTION_LABELS: Record<FunctionAction, string> = {
  'save-state': 'Save State',
  'load-state': 'Load State',
  'slot-next': 'Next Save Slot',
  'slot-prev': 'Previous Save Slot',
  'fast-forward': 'Fast Forward',
  menu: 'Menu',
  screenshot: 'Screenshot',
  pause: 'Pause',
  'profile-prev': 'Previous Input Profile',
  'profile-next': 'Next Input Profile',
};

const DEFAULT_FUNCTION_MAPPINGS: FunctionMapping[] = [
  { action: 'save-state', binding: { type: 'none' }, icon: null },
  { action: 'load-state', binding: { type: 'none' }, icon: null },
  { action: 'slot-next', binding: { type: 'none' }, icon: null },
  { action: 'slot-prev', binding: { type: 'none' }, icon: null },
  { action: 'fast-forward', binding: { type: 'keyboard', code: 'Tab' }, icon: null },
  { action: 'menu', binding: { type: 'keyboard', code: 'Escape' }, icon: null },
  { action: 'screenshot', binding: { type: 'keyboard', code: 'F12' }, icon: null },
  { action: 'pause', binding: { type: 'none' }, icon: null },
  { action: 'profile-prev', binding: { type: 'none' }, icon: null },
  { action: 'profile-next', binding: { type: 'none' }, icon: null },
];

export { DEFAULT_FUNCTION_MAPPINGS, FUNCTION_ACTIONS, FUNCTION_ACTION_LABELS };
