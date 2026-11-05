/* @layer bridge-wasm @kind logic */
import { CTAS_TYPE_TABLE } from '../../checks/checks.constants';
import { readPackEntries } from '../../checks/read-pack-entries';

const packRomSpans = (pack: Uint8Array, rom: number, length: number): number[] =>
  readPackEntries(pack)
    .filter((e) => e.type === CTAS_TYPE_TABLE && rom >= e.id && rom + length <= e.id + e.length)
    .map((e) => e.start + rom - e.id);

export { packRomSpans };
