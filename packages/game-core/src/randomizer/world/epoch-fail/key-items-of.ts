/* @layer bridge-wasm @kind logic */
import type { CtKeyItem } from '../ct-world-keys.type';
import type { CtModeDef } from '../modes/ct-mode-def.type';

const keyItemsOf = (mode: CtModeDef, epochFail: boolean): readonly CtKeyItem[] =>
  (epochFail ? [...mode.keyItems, 'jets-of-time'] : mode.keyItems);

export { keyItemsOf };
