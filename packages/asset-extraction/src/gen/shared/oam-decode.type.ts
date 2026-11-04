/* @layer shared-asset-extraction @kind types */
interface Sprite {
  idx: number;
  x: number;
  y: number;
  tile: number;
  attr: number;
  prio: number;
  pal: number;
  size: number;
  vflip: number;
  hflip: number;
  onscreen: boolean;
}

export type { Sprite };
