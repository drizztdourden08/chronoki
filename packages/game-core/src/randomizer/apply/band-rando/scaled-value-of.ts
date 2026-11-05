/* @layer bridge-wasm @kind logic */
import type { Band } from './band-rando.type';

const scaledValueOf = (value: number, band: Band, roll: number, limit: number): number =>
  Math.min(limit, Math.max(1, Math.round(value * (band.min + roll * (band.max - band.min)))));

export { scaledValueOf };
