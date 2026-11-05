/* @layer bridge-wasm @kind logic */
import type { CtKeyItem } from './ct-world-keys.type';
import type { PinnedItem } from './pinned-item.type';

const unpinnedKeyItems = (keyItems: readonly CtKeyItem[], pins: readonly PinnedItem[]): CtKeyItem[] => {
  const left = [...keyItems];
  pins.forEach(([, item]) => {
    const at = left.findIndex((key) => key === item);
    if (at >= 0) left.splice(at, 1);
  });
  return left;
};

export { unpinnedKeyItems };
