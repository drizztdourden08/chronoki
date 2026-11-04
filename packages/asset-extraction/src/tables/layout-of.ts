/* @layer shared-asset-extraction @kind logic */
import { describeType } from './c-types';
import type { PackTable } from './pack.type';

const layoutOf = (t: PackTable): string => `${t.name}=${describeType(t.ctype)}`;

export { layoutOf };
