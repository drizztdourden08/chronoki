/* @layer bridge-wasm @kind logic */
import { CT_ASPECT_HEIGHT, CT_ASPECT_MIN_WIDTH, CT_LETTERBOX_BELOW } from './aspect.constants';
import type { CkPresentBox } from './aspect.type';
import { ratioToWidth } from './ratio-to-width';

const letterboxBox = (ratio: number): CkPresentBox => {
  if (Number.isFinite(ratio) && ratio > 0 && ratio < CT_LETTERBOX_BELOW) {
    return { width: CT_ASPECT_MIN_WIDTH, height: Math.round(CT_ASPECT_MIN_WIDTH / ratio) };
  }
  return { width: ratioToWidth(ratio), height: CT_ASPECT_HEIGHT };
};

export { letterboxBox };
