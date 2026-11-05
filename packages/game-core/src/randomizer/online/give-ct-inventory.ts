/* @layer bridge-wasm @kind logic */
import { giveItem, ITEM_ID_MAX } from '../../cheats';
import type { CtGiveResult, CtGiveTarget } from './give-ct-item.type';

const giveCtInventory = (target: CtGiveTarget, id: number, count: number): CtGiveResult => {
  if (!Number.isInteger(id) || id < 1 || id > ITEM_ID_MAX || !Number.isInteger(count) || count < 1) return 'refused';
  return giveItem({ ...target, id, count }) ? 'settled' : 'retry';
};

export { giveCtInventory };
