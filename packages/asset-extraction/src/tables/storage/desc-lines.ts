/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import { layoutOf } from '../layout-of';
import { pointerOffsets } from '../pointer-offsets';
import { elementOf } from '../element-of';
import { fnv64 } from '../fnv64';
import { sortedTables } from './sorted-tables';
import { hex64 } from './hex64';

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

export { descLines };
