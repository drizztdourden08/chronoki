/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers';
import { layoutOf } from '../build-pack';
import type { CStruct } from '../c-type.type';
import { elementOf, pointerOffsets } from '../c-types';
import { fnv64 } from '../fnv64';
import type { PackTable } from '../pack.type';

const byName = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

const sortedTables = (hs: Headers): PackTable[] => [...hs.tables].sort((a, b) => byName(a.name, b.name));

const hex64 = (h: bigint): string => `0x${h.toString(16).toUpperCase().padStart(16, '0')}ULL`;

/** The struct types the compiler is asked to confirm: typedef'd structs and the anonymous element types of tables. */
const seenTypes = (hs: Headers): [string, CStruct][] => {
  const seen = new Map<string, CStruct>();
  for (const [n, ty] of hs.typedefs) if (ty.tag === 'struct') seen.set(n, ty);
  for (const t of hs.tables) {
    const el = elementOf(t.ctype);
    if (t.anon && el.tag === 'struct') seen.set(`CtTbl_${t.name}`, el);
  }
  return [...seen].sort((a, b) => byName(a[0], b[0]));
};

/** pack_tables.py make_headers(): the CT_TBL_CHECK asserts of the layout model (sizes and member offsets). */
const checkLines = (hs: Headers): string[] => {
  const lines: string[] = [];
  const check = (cond: string): number => lines.push(`CT_TBL_CHECK(t${lines.length}, ${cond});`);
  for (const [name, ty] of seenTypes(hs)) {
    check(`sizeof(${name}) == ${ty.size}`);
    for (const f of ty.fields) check(`offsetof(${name}, ${f.name}) == ${f.offset}`);
  }
  for (const t of sortedTables(hs)) check(`sizeof(${t.name}) == ${t.ctype.size}`);
  return lines;
};

/** The pointer offsets inside one element of each table that holds pointers, then the table descriptors. */
const pointerLines = (hs: Headers): string[] =>
  sortedTables(hs).flatMap((t) => {
    const offs = pointerOffsets(elementOf(t.ctype));
    return offs.length > 0 ? [`static const unsigned ctTblPtr_${t.name}[] = { ${offs.join(', ')} };`] : [];
  });

const descLines = (hs: Headers): string[] => {
  const tables = sortedTables(hs);
  const lines = ['const CtTableDesc ctTableDescs[] = {'];
  for (const t of tables) {
    const el = elementOf(t.ctype);
    const offs = pointerOffsets(el);
    const ptr = offs.length > 0 ? `ctTblPtr_${t.name}, ${offs.length}` : 'NULL, 0';
    lines.push(`  { "${t.name}", (void*)${t.name}, sizeof ${t.name}, ${hex64(fnv64(layoutOf(t)))}, ${el.size}, ${ptr} },`);
  }
  lines.push('};');
  lines.push('const int ctTableDescCount = (int)(sizeof ctTableDescs / sizeof ctTableDescs[0]);');
  lines.push(`const unsigned long long ctTableSetHash = ${hex64(fnv64(tables.map(layoutOf).join('\n')))};`);
  return lines;
};

export { checkLines, descLines, pointerLines };
