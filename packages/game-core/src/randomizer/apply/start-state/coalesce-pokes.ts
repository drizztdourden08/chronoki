/* @layer bridge-wasm @kind logic */
import type { ByteAt, CtPoke } from './ct-start-state.type';

const bytesOf = (poke: CtPoke): ByteAt[] =>
  poke.width === 1 ? [[poke.at, poke.value & 0xff]] : [[poke.at, poke.value & 0xff], [poke.at + 1, (poke.value >> 8) & 0xff]];

const runsOf = (pokes: readonly CtPoke[]): ByteAt[][] => {
  const bytes = [...new Map(pokes.flatMap(bytesOf)).entries()].sort((a, b) => a[0] - b[0]);
  return bytes.reduce<ByteAt[][]>((runs, byte) => {
    const run = runs[runs.length - 1];
    if (run !== undefined && (run[run.length - 1]?.[0] ?? -2) + 1 === byte[0]) run.push(byte);
    else runs.push([byte]);
    return runs;
  }, []);
};

const pokesOfRun = (run: readonly ByteAt[]): CtPoke[] => {
  const out: CtPoke[] = [];
  for (let i = 0; i < run.length; i += 2) {
    const [at, low] = run[i] as ByteAt;
    const high = run[i + 1];
    out.push(high === undefined ? { at, value: low, width: 1 } : { at, value: low | (high[1] << 8), width: 2 });
  }
  return out;
};

const coalescePokes = (pokes: readonly CtPoke[]): CtPoke[] => runsOf(pokes).flatMap(pokesOfRun);

export { coalescePokes };
