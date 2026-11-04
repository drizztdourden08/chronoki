/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { CK_EXPORT_ITEM_NAME } from '@chronoki/game-core';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import type { NameTable } from './game-info.type';
import { nameTableOf } from './name-table-of';

const readItemNames = (calls: CoreCalls, snapshot: GameInfoSnapshot): NameTable =>
  nameTableOf(calls, CK_EXPORT_ITEM_NAME, snapshot.inventory.map((item) => item.id));

export { readItemNames };
