/* @layer bridge-wasm @kind logic */
import { JETS_ITEM_ID } from '../session/jets-wings.constants';
import { giveCtGold } from './give-ct-gold';
import { giveCtInventory } from './give-ct-inventory';
import type { CtGiveAction, CtGiveResult, CtGiveTarget } from './give-ct-item.type';

const giveCtItem = (target: CtGiveTarget, action: CtGiveAction): CtGiveResult => {
  const { item } = action;
  if (item.type === 'gold') return giveCtGold(target, item.amount);
  if (item.type === 'tab') return giveCtInventory(target, item.stat.id, 1);
  if (item.type === 'jets') return giveCtInventory(target, JETS_ITEM_ID, 1);
  return giveCtInventory(target, item.romId, item.count);
};

export { giveCtItem };
