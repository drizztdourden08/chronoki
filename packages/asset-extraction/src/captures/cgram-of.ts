/* @layer shared-asset-extraction @kind logic */
import type { PeekDump } from '../oracle/peek.type';

const cgramOf = (peek: PeekDump): Uint8Array => peek.oam.slice(1056, 1056 + 512);

export { cgramOf };
