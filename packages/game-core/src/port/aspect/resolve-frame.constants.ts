/* @layer bridge-wasm @kind constants */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH, CT_EXTENDED_LINES } from './aspect.constants';
import type { CkResolvedFrame } from './aspect.type';

const ORIGINAL_FRAME: CkResolvedFrame = { width: CT_ASPECT_MIN_WIDTH, lines: CT_ASPECT_HEIGHT };
const EXTENDED_ORIGINAL_FRAME: CkResolvedFrame = { width: CT_ASPECT_MIN_WIDTH, lines: CT_EXTENDED_LINES };

export { EXTENDED_ORIGINAL_FRAME, ORIGINAL_FRAME };
