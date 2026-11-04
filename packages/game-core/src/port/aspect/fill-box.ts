/* @layer bridge-wasm @kind logic */
import { CT_FILL_SNAP } from './aspect.constants';
import type { CkArea } from './aspect.type';
import { containBox } from './contain-box';

const fillBox = (ratio: number, stage: CkArea): CkArea => {
  if (!(ratio > 0) || stage.width <= 0 || stage.height <= 0) return stage;
  const off = Math.abs(stage.width / stage.height / ratio - 1);
  return off <= CT_FILL_SNAP ? stage : containBox(ratio, stage);
};

export { fillBox };
