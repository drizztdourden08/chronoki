/* @layer renderer-components @kind logic */
import { SLOT_ACTION_PREFIXES } from '../SaveStateOverlay.constants';

const isSlotAction = (action: string): boolean => SLOT_ACTION_PREFIXES.some((prefix) => action.startsWith(prefix));

export { isSlotAction };
