/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';

const isCharScalar = (t: CType): boolean => t.tag === 'scalar' && t.kind === 'c8';

export { isCharScalar };
