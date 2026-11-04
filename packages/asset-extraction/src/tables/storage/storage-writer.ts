/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import { runtimeDefines } from './storage-defines';
import { compiledIn } from './compiled-in';
import { checkLines } from './storage-tables';
import { descLines } from './desc-lines';
import { pointerLines } from './pointer-lines';
import { BASE_HEADER, DOC, DEFINES_DOC } from './storage-writer.constants';

const defineLines = (hs: Headers): string[] => {
  const defines = hs.numericDefines();
  const keep = compiledIn(hs, defines);
  const kinds = new Map(runtimeDefines(hs, defines).map((d) => [d.name, d.ctype]));
  const lines = defines.map(({ name }) =>
    keep.has(name)
      ? `  { "${name}", (long long)(${name}), NULL, 0 },`
      : `  { "${name}", 0, &ctDef_${name}, ${kinds.get(name) === 'int' ? 'CT_TBL_DEF_INT' : 'CT_TBL_DEF_UINT'} },`,
  );
  return [DEFINES_DOC, 'const CtTableDefine ctTableDefines[] = {', ...lines, '};'];
};

const writeTablesStorage = (hs: Headers): string => {
  const order = [...hs.texts.keys()].sort((a, b) => Number(a !== BASE_HEADER) - Number(b !== BASE_HEADER));
  const lines = [
    DOC,
    '#ifndef CT_DATAFREE\n#error "tables_storage.c is compiled only by a data-free build (CT_DATAFREE)"\n#endif',
    '#define CT_TBL_STORAGE',
    '#define CT_TBL_EXTERN',
    '#define CT_TBL_CONST',
    '#include <stddef.h>',
    ...order.map((h) => `#include "${h}"`),
    '#include "../datapack.h"',
    '',
    '/* The layout model of tools/gen/pack_tables.py, checked against this compiler. */',
    '#define CT_TBL_CHECK(name, cond) typedef char ct_tbl_check_##name[(cond) ? 1 : -1]',
    ...checkLines(hs),
    '',
    '/* Where each table holds pointers: the offsets inside one element (the type under every dimension). */',
    ...pointerLines(hs),
    '',
    ...descLines(hs),
    '',
    ...defineLines(hs),
    'const int ctTableDefineCount = (int)(sizeof ctTableDefines / sizeof ctTableDefines[0]);',
  ];
  return `${lines.join('\n')}\n`;
};

export { writeTablesStorage };
