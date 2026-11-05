/* @layer bridge-wasm @kind constants */
import type { CtModeDef } from './ct-mode-def.type';
import { stubModeOf } from './stub-mode-of';

const LEGACY_OF_CYRUS_MODE: CtModeDef = stubModeOf('legacy-of-cyrus', 'Legacy of Cyrus', { goal: 'beat-ozzie' });

export { LEGACY_OF_CYRUS_MODE };
