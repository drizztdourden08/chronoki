/* @layer shared-asset-extraction @kind logic @source Python rom_closure_battle.anim_oplen, extract_assets._lz_skipped, extract_assets.pack_tables */
import { T_TABLE } from './asset-types.constants';
import { tableSpans } from './closure/rom-tables';
import type { ClosureInputs } from './closure/rom-tables';
import type { WorkStore } from '../pipeline/work-store.type';
import type { Packer } from './extract.type';

const readAnimLens = async (work: WorkStore): Promise<number[]> => {
  const b = await work.readBytes('saves/anim_oplen.bin');
  if (b === null) throw new Error('rom_closure_battle: saves/anim_oplen.bin is missing -- run the anim_oplen generator');
  return Array.from(b, (x) => (x >= 128 ? x - 256 : x));
};

const readLzSkipped = async (work: WorkStore): Promise<Set<number>> => {
  const b = await work.readBytes('saves/lz_pack.skipped');
  if (b === null) return new Set();
  const lines = new TextDecoder().decode(b).split('\n').filter((l) => l.trim() !== '');
  return new Set(lines.map((l) => Number.parseInt(l.trim(), 16)));
};

const packTables: Packer = async ({ rom, work }) => {
  const inputs: ClosureInputs = { animLens: await readAnimLens(work), lzSkipped: await readLzSkipped(work) };
  return tableSpans(rom, inputs).map(([a, b]) => ({ type: T_TABLE, id: a, blob: rom.slice(a, b) }));
};

export { packTables };
