/* @layer shared-asset-extraction @kind logic */
import { ptr24 } from './closure-locations';

const streamsOf = (rom: Uint8Array, table: number, ids: Iterable<number>): Set<number> => {
  const out = new Set<number>();
  for (const i of ids) {
    const o = ptr24(rom, table + 3 * i);
    if (o !== null) out.add(o);
  }
  return out;
};

export { streamsOf };
