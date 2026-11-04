/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from '../pipeline/work-store.type';
import { requireBytes } from '../pipeline/require-bytes';
import { createHeaders } from './c-parse/headers';
import type { Headers } from './c-parse/headers.type';
import { PackError } from './pack-error';
import type { TableAbi } from './table-abi.type';
import { SHAPE_MARK, BASE_HEADER } from './pack-headers.constants';

const parseOrder = (names: string[]): string[] => [...names].sort().sort((a, b) => Number(a !== BASE_HEADER) - Number(b !== BASE_HEADER));

const startsWithShapeMark = (bytes: Uint8Array): boolean =>
  new TextDecoder('latin1').decode(bytes.subarray(0, SHAPE_MARK.length)) === SHAPE_MARK;

const parseWorkHeaders = async (work: WorkStore, names: string[], abi: TableAbi): Promise<Headers> => {
  const hs = createHeaders(abi);
  const stillShapes: string[] = [];
  for (const n of parseOrder(names)) {
    const bytes = await requireBytes(work, `src/data/${n}`);
    if (startsWithShapeMark(bytes)) stillShapes.push(n);
    hs.parseFile(bytes, n);
  }
  if (stillShapes.length > 0) {
    throw new PackError(`${stillShapes.length} header(s) are still shapes, not generated from the ROM: ${stillShapes.sort().join(', ')}`);
  }
  return hs;
};

export { parseOrder, parseWorkHeaders };
