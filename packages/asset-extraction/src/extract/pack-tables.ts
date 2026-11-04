/* @layer shared-asset-extraction @kind logic */
import { T_TABLE } from './asset-types.constants';
import { tableSpans } from './closure/rom-tables';
import type { ClosureInputs } from './closure/rom-tables';
import type { WorkStore } from '../pipeline/work-store.type';
import type { Packer } from './extract.type';

/** rom_closure_battle.anim_oplen: saves/anim_oplen.bin as signed bytes (-1 = no length); the file is required. */
const readAnimLens = async (work: WorkStore): Promise<number[]> => {
  const b = await work.readBytes('saves/anim_oplen.bin');
  if (b === null) throw new Error('rom_closure_battle: saves/anim_oplen.bin is missing -- run the anim_oplen generator');
  return Array.from(b, (x) => (x >= 128 ? x - 256 : x));
};

/** extract_assets._lz_skipped: the offsets lz_pack listed that are not LZ streams (saves/lz_pack.skipped, one hex offset a line). */
const readLzSkipped = async (work: WorkStore): Promise<Set<number>> => {
  const b = await work.readBytes('saves/lz_pack.skipped');
  if (b === null) return new Set();
  const lines = new TextDecoder().decode(b).split('\n').filter((l) => l.trim() !== '');
  return new Set(lines.map((l) => Number.parseInt(l.trim(), 16)));
};

/** extract_assets.pack_tables: each ROM table span (the closure over every location and the engine's readers), id = its start offset. */
const packTables: Packer = async ({ rom, work }) => {
  const inputs: ClosureInputs = { animLens: await readAnimLens(work), lzSkipped: await readLzSkipped(work) };
  return tableSpans(rom, inputs).map(([a, b]) => ({ type: T_TABLE, id: a, blob: rom.slice(a, b) }));
};

export { packTables };
