/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';

const isAggregate = (t: CType): boolean => t.tag === 'array' || t.tag === 'struct';

export { isAggregate };
