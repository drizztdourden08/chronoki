/* @layer bridge-wasm @kind type */
import type { BridgeTrackState } from './music-state.type';

type CollectedMusic = {
  ctrls: readonly number[];
  state: BridgeTrackState;
};

export type { CollectedMusic };
