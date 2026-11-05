/* @layer bridge-wasm @kind logic */
import type { PackEntry } from '../checks/read-pack-entries.type';
import { CTAS_TYPE_LZ, LZ_DATA_AT } from './apply.constants';

const sameBytes = (pack: Uint8Array, a: number, b: number, length: number): boolean => {
  for (let i = 0; i < length; i += 1) if (pack[a + i] !== pack[b + i]) return false;
  return true;
};

const scriptCopiesOf = (pack: Uint8Array, entries: readonly PackEntry[], script: PackEntry): number[] => [
  script.start,
  ...entries
    .filter((e) => e.type === CTAS_TYPE_LZ && e.length >= LZ_DATA_AT + script.length)
    .filter((e) => sameBytes(pack, e.start + LZ_DATA_AT, script.start, script.length))
    .map((e) => e.start + LZ_DATA_AT),
];

export { scriptCopiesOf };
