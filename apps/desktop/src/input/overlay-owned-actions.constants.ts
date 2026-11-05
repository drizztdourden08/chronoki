/* @layer renderer-lib @kind constants */
import { LOAD_SLOT_ACTIONS, SAVE_SLOT_ACTIONS } from '@chronoki/input-mapping';
import type { FunctionAction } from '@chronoki/input-mapping';

const OVERLAY_OWNED_ACTIONS: ReadonlySet<FunctionAction> = new Set([...SAVE_SLOT_ACTIONS, ...LOAD_SLOT_ACTIONS]);

export { OVERLAY_OWNED_ACTIONS };
