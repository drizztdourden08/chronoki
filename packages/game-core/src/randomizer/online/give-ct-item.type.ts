/* @layer bridge-wasm @kind type */
import type { CheatWrite } from '../../cheats';
import type { TabStatSlot } from '../session/tab-stat-slot.type';

type CtGiveItem =
  | { type: 'inventory'; romId: number; count: number }
  | { type: 'gold'; amount: number }
  | { type: 'tab'; stat: TabStatSlot }
  | { type: 'jets' };

type CtGiveAction = { kind: 'give'; item: CtGiveItem };

type CtGiveResult = 'settled' | 'retry' | 'refused';

type CtGiveTarget = { heap: Uint8Array; ptr: number; write: CheatWrite };

export type { CtGiveAction, CtGiveItem, CtGiveResult, CtGiveTarget };
