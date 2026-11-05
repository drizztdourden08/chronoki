/* @layer bridge-wasm @kind type */
import type { PackEntry } from '../../checks/read-pack-entries.type';

type GiftProbe = { id: string; expected: number; spots: number[]; script?: PackEntry };

export type { GiftProbe };
