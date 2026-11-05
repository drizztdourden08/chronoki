/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';

type HeadlessGrants = { observe(): void; started(): boolean; goldGranted(): boolean; magicGranted(): boolean; view(): MemoryView | null };

export type { HeadlessGrants };
