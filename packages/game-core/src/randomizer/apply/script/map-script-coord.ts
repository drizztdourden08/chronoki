/* @layer bridge-wasm @kind logic */
import type { SpliceShift } from './script-splice.type';

const mapScriptCoord = (coord: number, shift: SpliceShift): number | null => {
  if (coord <= shift.at) return coord;
  if (coord < shift.end) return null;
  return coord + shift.delta;
};

export { mapScriptCoord };
