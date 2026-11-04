/* @layer shared-asset-extraction @kind logic */
import { rgb } from './rgb';

const rgba = (cg: Uint8Array, i: number): [number, number, number, number] =>
  i % 16 === 0 ? [0, 0, 0, 0] : [...rgb(cg, i), 255];

export { rgba };
