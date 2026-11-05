/* @layer bridge-wasm @kind logic */
import { MAX_DISPLACEMENT } from './script-splice.constants';

const jumpDisplacement = (back: boolean, newBase: number, target: number): number | null => {
  const fixed = back ? newBase - target : target - newBase;
  return fixed < 0 || fixed > MAX_DISPLACEMENT ? null : fixed;
};

export { jumpDisplacement };
