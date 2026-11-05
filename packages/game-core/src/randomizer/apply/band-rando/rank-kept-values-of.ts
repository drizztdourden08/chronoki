/* @layer bridge-wasm @kind logic */
import type { Band } from './band-rando.type';
import { scaledValueOf } from './scaled-value-of';

const rankKeptValuesOf = (values: readonly number[], band: Band, rolls: readonly number[], limit: number): number[] => {
  const scaled = values.map((value, i) => scaledValueOf(value, band, rolls[i] ?? 0, limit)).sort((a, b) => a - b);
  const order = values.map((_, i) => i).sort((a, b) => (values[a] ?? 0) - (values[b] ?? 0) || a - b);
  const out = new Array<number>(values.length).fill(0);
  order.forEach((index, rank) => {
    out[index] = scaled[rank] ?? 0;
  });
  return out;
};

export { rankKeptValuesOf };
