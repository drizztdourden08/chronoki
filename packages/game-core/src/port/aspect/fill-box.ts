/* @layer bridge-wasm @kind logic */
import { CT_FILL_SNAP } from './aspect.constants';
import type { CkArea } from './aspect.type';
import { containBox } from './contain-box';

/* The box a picture of this ratio fills: the whole stage when the ratio is within CT_FILL_SNAP of the stage's own (16:9 on a
   16:9 screen fills it edge to edge), else the ratio's box inside the stage (a deliberate 4:3 or 21:9 keeps its bars). */
const fillBox = (ratio: number, stage: CkArea): CkArea => {
  if (!(ratio > 0) || stage.width <= 0 || stage.height <= 0) return stage;
  const off = Math.abs(stage.width / stage.height / ratio - 1);
  return off <= CT_FILL_SNAP ? stage : containBox(ratio, stage);
};

export { fillBox };
