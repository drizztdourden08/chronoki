/* @layer bridge-wasm @kind constants */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH } from './aspect.constants';
import type { CkResolvedFrame } from './aspect.type';

const ORIGINAL_FRAME: CkResolvedFrame = { width: CT_ASPECT_MIN_WIDTH, lines: CT_ASPECT_HEIGHT };

export { ORIGINAL_FRAME };
