/* @layer bridge-wasm @kind constants */
import { CT_ASPECT_MAX_WIDTH, CT_ASPECT_MIN_WIDTH, CT_EXTENDED_LINES, CT_TALL_MAX_LINES } from './aspect.constants';
import type { CkFrameRanges } from './aspect.type';

const CT_WIDE_RANGES: CkFrameRanges = {
  minWidth: CT_ASPECT_MIN_WIDTH, maxWidth: CT_ASPECT_MAX_WIDTH, minHeight: CT_EXTENDED_LINES, maxHeight: CT_EXTENDED_LINES,
};

const CT_TALL_RANGES: CkFrameRanges = {
  minWidth: CT_ASPECT_MIN_WIDTH, maxWidth: CT_ASPECT_MIN_WIDTH, minHeight: CT_EXTENDED_LINES, maxHeight: CT_TALL_MAX_LINES,
};

const CT_FREE_RANGES: CkFrameRanges = {
  minWidth: CT_ASPECT_MIN_WIDTH, maxWidth: CT_ASPECT_MAX_WIDTH, minHeight: CT_EXTENDED_LINES, maxHeight: CT_TALL_MAX_LINES,
};

export { CT_FREE_RANGES, CT_TALL_RANGES, CT_WIDE_RANGES };
