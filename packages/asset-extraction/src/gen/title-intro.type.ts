/* @layer shared-asset-extraction @kind type */
interface TitleCapture {
  tmap: number[];
  chr8: number[];
  /** Mode-7 tiles used. */
  nt: number;
  box: { r0: number; c0: number; w: number; h: number };
  /** The VRAM word at a word address, from the gfx capture. */
  w: (addr: number) => number;
  /** The seed WRAM. */
  seed: Uint8Array;
  slidePkg: number[];
  npkg: number;
  sin: Uint8Array;
  scriptBase: number;
  scriptEnd: number;
  pkgBase: number;
  pkgEnd: number;
  vbase: number;
  vwords: number;
  seedFrame: number;
}

export type { TitleCapture };
