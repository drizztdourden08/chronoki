/* @layer shared-asset-extraction @kind logic */
import type { PeekResult } from './oracle-tools.type';
import { CGRAM_AT } from './require-tools.constants';

const cgramOf = (peeked: PeekResult): Uint8Array => peeked.oam.subarray(CGRAM_AT, CGRAM_AT + 512);

export { cgramOf };
