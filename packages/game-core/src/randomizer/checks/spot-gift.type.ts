/* @layer bridge-wasm @kind type */
import type { CtOptionKey, CtSpotId } from '../world/ct-world-keys.type';

type SpotGift = {
  spot: CtSpotId;
  option: CtOptionKey;
  scene: number;
  anchor: readonly number[];
  why: string;
};

export type { SpotGift };
