/* @layer shared-asset-extraction @kind type */
import type { Sprite } from './shared/oam-decode.type';

interface MarleKf {
  pose: string;
  rf: number;
  ax: number;
  ay: number;
  on: Sprite[];
  tiles: Uint8Array[];
}
interface SparkKf {
  pose: string;
  rf: number;
  spr: Sprite;
  vram: Uint8Array;
}
type TrajRow = [number, number, number, number];

export type { MarleKf, SparkKf, TrajRow };
