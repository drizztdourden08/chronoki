/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import type { CStruct } from '../c-type.type';

import { elementOf } from '../element-of';

import { byName } from './by-name';
import { sortedTables } from './sorted-tables';

const seenTypes = (hs: Headers): [string, CStruct][] => {
  const seen = new Map<string, CStruct>();
  for (const [n, ty] of hs.typedefs) if (ty.tag === 'struct') seen.set(n, ty);
  for (const t of hs.tables) {
    const el = elementOf(t.ctype);
    if (t.anon && el.tag === 'struct') seen.set(`CtTbl_${t.name}`, el);
  }
  return [...seen].sort((a, b) => byName(a[0], b[0]));
};

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

export { checkLines };
