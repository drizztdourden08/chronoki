/* @layer bridge-wasm @kind type */
import type { TabKind } from '../world/tabs/tab-amounts.type';

type TabStatSlot = { kind: TabKind; id: number; base: number; work: number; baseCap: number };

type TabSnapshot = { counts: ReadonlyMap<number, number>; stats: readonly (readonly number[])[] };

export type { TabSnapshot, TabStatSlot };
