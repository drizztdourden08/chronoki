/* @layer bridge-wasm @kind constants */
import type { CtModeId } from '../../world/modes/ct-mode-def.type';
import type { ModeSplicer } from '../mode-splicer.type';
import { iceAgeSplices } from './ice-age-splices';
import { locSplices } from './loc-splices';

const MODE_SPLICERS: Readonly<Partial<Record<CtModeId, ModeSplicer>>> = {
  'legacy-of-cyrus': locSplices,
  'ice-age': iceAgeSplices,
};

export { MODE_SPLICERS };
