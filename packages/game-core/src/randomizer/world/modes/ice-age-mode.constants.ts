/* @layer bridge-wasm @kind constants */
import type { CtModeDef } from './ct-mode-def.type';
import { stubModeOf } from './stub-mode-of';

const ICE_AGE_MODE: CtModeDef = stubModeOf('ice-age', 'Ice Age', { goal: 'ice-age-woe' });

export { ICE_AGE_MODE };
