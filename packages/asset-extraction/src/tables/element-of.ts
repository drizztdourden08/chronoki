/* @layer shared-asset-extraction @kind logic */
import type { CType } from './c-type.type';

const elementOf = (t: CType): CType => (t.tag === 'array' ? elementOf(t.elem) : t);

export { elementOf };
