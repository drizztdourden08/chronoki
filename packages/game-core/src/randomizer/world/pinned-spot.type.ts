/* @layer bridge-wasm @kind type */
import type { CtItem, CtSpotId } from './ct-world-keys.type';

type PinnedSpot = readonly [CtSpotId, CtItem];

export type { PinnedSpot };
