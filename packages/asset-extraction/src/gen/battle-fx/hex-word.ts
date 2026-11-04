/* @layer shared-asset-extraction @kind logic */
import { hex } from '../c-hex';

const w4 = (w: number): string => hex(w, 4);

export { w4 };
