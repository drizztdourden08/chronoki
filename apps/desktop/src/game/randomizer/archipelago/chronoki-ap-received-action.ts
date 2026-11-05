/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import { isFromServer } from '@drizztdourden08/brock-randomizer/archipelago';
import { ctApIds } from '@chronoki/game-core/archipelago';
import { ctGiveActionOf } from '@chronoki/game-core';
import { chronokiApCurrentSlot } from './chronoki-ap-current-slot';

const chronokiApReceivedAction: ArchipelagoGame<unknown, unknown>['receivedAction'] = (item) => {
  const key = ctApIds.itemKeyOf(item.item);
  const action = key === undefined ? null : ctGiveActionOf(key);
  if (action === null) return null;
  const fromServer = isFromServer(item, chronokiApCurrentSlot.get());
  return { message: fromServer ? item.itemName : `${item.senderName}: ${item.itemName}`, action };
};

export { chronokiApReceivedAction };
