/* @layer shared-asset-extraction @kind type */
import type { Rgb3 } from './battle-hud-strip.type';
import type { MapCell } from './battle-hud-bake.type';

interface HudBake {
  palE: Rgb3[][];
  palC: Rgb3[][];
  mapE: MapCell[][];
  mapC: MapCell[][];
  bg1Pal: Rgb3[];
  bg1IdxE: number[][];
  bg1IdxC: number[][];
}

export type { HudBake };
