/* @layer shared-asset-extraction @kind types */
import type { Sprite } from '../shared/oam-decode';

type Spec = [pal: number, pose: string, repF: number, ...extra: number[]];

interface AddKf {
  pal: number;
  pose: string;
  rf: number;
  extra: number[];
  nObj: number;
  ax: number;
  ay: number;
  on: Sprite[];
}

interface AddGroup {
  kfs: AddKf[];
  tiles: Uint8Array[][];
}

export type { Spec, AddKf, AddGroup };
