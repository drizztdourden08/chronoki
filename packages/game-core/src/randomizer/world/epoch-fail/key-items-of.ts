/* @layer bridge-wasm @kind logic */
import type { CtKeyItem } from '../ct-world-keys.type';
import type { CtModeDef } from '../modes/ct-mode-def.type';

const keyItemsOf = (mode: CtModeDef, epochFail: boolean, vanillaRoboRibbon = false): readonly CtKeyItem[] => {
  const base = vanillaRoboRibbon ? mode.keyItems.filter((item) => item !== 'robo-ribbon') : mode.keyItems;
  return epochFail ? [...base, 'jets-of-time'] : base;
};

export { keyItemsOf };
