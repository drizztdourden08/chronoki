/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { WramWrite } from './start-gold-grant.type';
import type { TabStatSlot } from './tab-stat-slot.type';

type TabBoost = { view: MemoryView; write: WramWrite; slot: TabStatSlot; sheet: number; extra: number };

export type { TabBoost };
