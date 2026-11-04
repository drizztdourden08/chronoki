/* @layer shared-asset-extraction @kind logic */
import type { Headers } from '../c-parse/headers.type';
import { pointerOffsets } from '../pointer-offsets';
import { elementOf } from '../element-of';
import { sortedTables } from './sorted-tables';

const pointerLines = (hs: Headers): string[] =>
  sortedTables(hs).flatMap((t) => {
    const offs = pointerOffsets(elementOf(t.ctype));
    return offs.length > 0 ? [`static const unsigned ctTblPtr_${t.name}[] = { ${offs.join(', ')} };`] : [];
  });

export { pointerLines };
