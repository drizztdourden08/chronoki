/* @layer shared-asset-extraction @kind type */
type Fmt = (v: number) => string;

interface TitleCapture {
  tmap: number[];
  chr8: number[];
  nt: number;
  box: { r0: number; c0: number; w: number; h: number };
  w: (addr: number) => number;
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

export type { Fmt, TitleCapture };
