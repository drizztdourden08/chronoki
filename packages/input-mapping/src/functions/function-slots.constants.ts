/* @layer shared-input @kind constants */
import type { FunctionMapping, SlotFunctionAction, SlotNumber } from './function-mapping.type';

const SLOT_NUMBERS: readonly SlotNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const SAVE_SLOT_ACTIONS: readonly SlotFunctionAction[] = SLOT_NUMBERS.map((n) => `save-state-${n}` as const);

const LOAD_SLOT_ACTIONS: readonly SlotFunctionAction[] = SLOT_NUMBERS.map((n) => `load-state-${n}` as const);

const SLOT_FUNCTION_LABELS: Record<SlotFunctionAction, string> = Object.fromEntries([
  ...SLOT_NUMBERS.map((n) => [`save-state-${n}`, `Save State ${n}`]),
  ...SLOT_NUMBERS.map((n) => [`load-state-${n}`, `Load State ${n}`]),
]) as Record<SlotFunctionAction, string>;

const SAVE_SLOT_KEY_LIMIT = 10;

const SLOT_DEFAULT_MAPPINGS: FunctionMapping[] = [
  ...SLOT_NUMBERS.map((n): FunctionMapping => ({
    action: `save-state-${n}`,
    binding: n <= SAVE_SLOT_KEY_LIMIT ? { type: 'keyboard', code: `F${n}` } : { type: 'none' },
    icon: null,
  })),
  ...SLOT_NUMBERS.map((n): FunctionMapping => ({
    action: `load-state-${n}`,
    binding: { type: 'keyboard', code: `F${n}`, modifiers: { shift: true } },
    icon: null,
  })),
];

export { LOAD_SLOT_ACTIONS, SAVE_SLOT_ACTIONS, SLOT_DEFAULT_MAPPINGS, SLOT_FUNCTION_LABELS, SLOT_NUMBERS };
