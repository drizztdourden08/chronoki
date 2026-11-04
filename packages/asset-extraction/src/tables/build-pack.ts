/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';
import type { CtasEntry } from '../ctas/ctas.type';
import { T_TABLE, T_TABLE_DEFINES, T_TABLE_HEADER, T_TABLE_POOL } from '../ctas/ctas.constants';
import { tableContainer } from '../ctas/table-container';
import { describeType, pointerOffsets } from './c-types';
import { fnv64 } from './fnv64';
import { createInitWriter } from './init-writer';
import { PackError } from './pack-error';
import type { BuiltTable, ConstEval, PackDefine, PackTable } from './pack.type';
import { createStringPool } from './string-pool';
import type { TableAbi } from './table-abi.type';

const FORMAT_VERSION = 1;
const LITTLE_ENDIAN = 1;
const encoder = new TextEncoder();

/** pack_tables.py Table.layout(): the name and its type spelled out; the loader refuses a pack whose hash differs. */
const layoutOf = (t: PackTable): string => `${t.name}=${describeType(t.ctype)}`;

const entryHeader = (built: BuiltTable[], defines: PackDefine[], abi: TableAbi): CtasEntry => {
  const w = createLeWriter();
  w.bytes(encoder.encode('CTTB'));
  w.u32(FORMAT_VERSION);
  w.u32(abi.pointerSize);
  w.u32(LITTLE_ENDIAN);
  w.u32(built.length);
  w.u32(defines.length);
  w.u64(fnv64(built.map((b) => layoutOf(b.table)).join('\n')));
  return { type: T_TABLE_HEADER, id: 0, blob: w.toBytes() };
};

/** [name len u8][name][pad to 4][size u32][layout hash u64][reloc count u32][reloc offsets u32 x n][the bytes]. */
const entryTable = (b: BuiltTable, id: number): CtasEntry => {
  const name = encoder.encode(b.table.name);
  const w = createLeWriter();
  w.u8(name.length);
  w.bytes(name);
  w.zeros((4 - ((1 + name.length) % 4)) % 4);
  w.u32(b.data.length);
  w.u64(fnv64(layoutOf(b.table)));
  w.u32(b.relocs.length);
  for (const r of b.relocs) w.u32(r);
  w.bytes(b.data);
  return { type: T_TABLE, id, blob: w.toBytes() };
};

const entryDefines = (defines: PackDefine[]): CtasEntry => {
  const w = createLeWriter();
  w.u32(defines.length);
  for (const d of defines) {
    const name = encoder.encode(d.name);
    w.u8(name.length);
    w.bytes(name);
    w.i64(d.value);
  }
  return { type: T_TABLE_DEFINES, id: 0, blob: w.toBytes() };
};

interface PackInput {
  tables: PackTable[];
  defines: PackDefine[];
  evalConst: ConstEval;
  abi: TableAbi;
}

/** Writes one table's bytes; a pointer the initializer left out is NULL (all ones, pointer-wide). */
const buildTable = (t: PackTable, input: PackInput, pool: ReturnType<typeof createStringPool>): BuiltTable => {
  const buf = new Uint8Array(t.ctype.size);
  const relocs: number[] = [];
  const writer = createInitWriter({ tableName: t.name, header: t.header, buf, relocs, pool, evalConst: input.evalConst });
  writer.braced(t.ctype, 0, t.init, false);
  const size = input.abi.pointerSize;
  for (const off of pointerOffsets(t.ctype).filter((o) => !relocs.includes(o))) buf.fill(0xff, off, off + size);
  return { table: t, data: buf, relocs: pointerOffsets(t.ctype) };
};

/** pack_tables.py build_pack(): the table pack (a CTAS container of the four table entry types). */
const buildPack = (input: PackInput): { pack: Uint8Array; built: BuiltTable[] } => {
  const pool = createStringPool();
  const sorted = [...input.tables].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const built = sorted.map((t) => buildTable(t, input, pool));
  if (new Set(built.map((b) => b.table.name)).size !== built.length) throw new PackError('two tables share a name');
  const entries: CtasEntry[] = [entryHeader(built, input.defines, input.abi)];
  built.forEach((b, i) => entries.push(entryTable(b, i)));
  entries.push({ type: T_TABLE_POOL, id: 0, blob: pool.bytes() });
  entries.push(entryDefines(input.defines));
  return { pack: tableContainer(entries), built };
};

export { buildPack, layoutOf };
export type { PackInput };
