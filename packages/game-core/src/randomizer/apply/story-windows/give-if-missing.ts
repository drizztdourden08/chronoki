/* @layer bridge-wasm @kind logic */
import { OP_ADD_ITEM } from '../../checks/gift-ops.constants';
import { OP_IF_HAS_ITEM, OP_JUMP } from './story-window-gifts.constants';

const giveIfMissing = (item: number): number[] => [OP_IF_HAS_ITEM, item, 0x03, OP_JUMP, 0x03, OP_ADD_ITEM, item];

export { giveIfMissing };
