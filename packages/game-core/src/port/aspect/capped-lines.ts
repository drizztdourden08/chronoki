/* @layer bridge-wasm @kind logic */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MAX_WIDTH, CT_EXTENDED_LINES } from './aspect.constants';

const cappedLines = (ratio: number): number => {
  if (!Number.isFinite(ratio) || ratio <= 0) return CT_EXTENDED_LINES;
  const even = Math.ceil(CT_ASPECT_MAX_WIDTH / ratio / 2 - 1e-6) * 2;
  return Math.min(CT_EXTENDED_LINES, Math.max(CT_ASPECT_HEIGHT, even));
};

export { cappedLines };
