/* @layer bridge-wasm @kind logic */
import type { CtTreasureItem } from './ct-world-keys.type';

const treasureItemOf = (romId: number): CtTreasureItem => `treasure-${romId.toString(16).padStart(3, '0')}`;

export { treasureItemOf };
