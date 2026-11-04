/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from '../pipeline/work-store.type';
import { requireBytes } from '../pipeline/work-files';
import { createHeaders } from './c-parse/headers';
import type { Headers } from './c-parse/headers';
import { PackError } from './pack-error';
import type { TableAbi } from './table-abi.type';

const SHAPE_MARK = '/* SHAPE of a generated file';
const BASE_HEADER = 'battle_anim.h';

/** pack_tables.py parse_dir(): battle_anim.h first (two headers use its types), the rest by name. */
const parseOrder = (names: string[]): string[] => [...names].sort().sort((a, b) => Number(a !== BASE_HEADER) - Number(b !== BASE_HEADER));

const startsWithShapeMark = (bytes: Uint8Array): boolean =>
  new TextDecoder('latin1').decode(bytes.subarray(0, SHAPE_MARK.length)) === SHAPE_MARK;

/** The generated headers src/data/<names> of a workdir, parsed for the target; a header still a shape is refused. */
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
