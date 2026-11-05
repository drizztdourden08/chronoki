/* @layer renderer-components @kind constants */
import type { CtPackState } from './ct-pack-state.type';

const PACK_PENDING: CtPackState = { pack: null, error: undefined };

const NO_ROM_STATE: CtPackState = { pack: null, error: 'Pick a ROM to see the item pool.' };

export { NO_ROM_STATE, PACK_PENDING };
