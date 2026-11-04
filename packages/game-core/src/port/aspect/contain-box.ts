/* @layer bridge-wasm @kind logic */
import type { CkArea } from './aspect.type';

const containBox = (ratio: number, area: CkArea): CkArea => {
  if (!(ratio > 0) || area.width <= 0 || area.height <= 0) return area;
  return area.width / area.height > ratio
    ? { width: area.height * ratio, height: area.height }
    : { width: area.width, height: area.width / ratio };
};

export { containBox };
