/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';
import { CHAR_KINDS } from './scalars.constants';

const isCharArray = (t: CType): boolean => t.tag === 'array' && t.elem.tag === 'scalar' && CHAR_KINDS.includes(t.elem.kind);

export { isCharArray };
