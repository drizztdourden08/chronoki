/* @layer shared-asset-extraction @kind types */
import type { Key } from './anim-consts.type';
import type { Sprite } from '../shared/oam-decode';

interface Keyframe {
  key: Key;
  objOff: number;
  nObj: number;
  ax: number;
  ay: number;
}

interface Collected {
  kfs: Keyframe[];
  objFlat: Sprite[];
  tiles: Uint8Array[][];
  cgram: Uint8Array;
}

export type { Keyframe, Collected };
