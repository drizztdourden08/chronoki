/* @layer renderer-appshell @kind constants */
import { SLOT_NUMBERS } from '@chronoki/input-mapping';
import type { FunctionAction } from '@chronoki/input-mapping';
import { loadFromSlot } from './load-from-slot';
import { pressSlotKey } from './press-slot-key';

const SLOT_HANDLERS: Partial<Record<FunctionAction, () => void | Promise<void>>> = Object.fromEntries(
  SLOT_NUMBERS.flatMap((n) => [
    [`save-state-${n}`, () => pressSlotKey(n)],
    [`load-state-${n}`, () => loadFromSlot(n - 1)],
  ]),
);

export { SLOT_HANDLERS };
