/* @layer shared-asset-extraction @kind types */

interface SpriteHeader {
  bitmap: number;
  assembly: number;
  palette: number;
  anim: number;
  size: number;
}

interface SpriteTables {
  gfxPtrs: number[];
  palPtrs: number[];
  asmPtrs: number[];
}

export type { SpriteHeader, SpriteTables };
