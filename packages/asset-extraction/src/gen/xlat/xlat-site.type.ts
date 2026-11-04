/* @layer shared-asset-extraction @kind types */

/** One instruction of the translated program (xlat.py's sites[adr] dict). */
interface Site {
  op: number;
  bytes: number[];
  len: number;
  m: number;
  x: number;
  traced: boolean;
  smc: boolean;
  /** The distinct byte tuples seen at this address ("1,2,3" keys); more than one means a self-modified operand. */
  variants: Set<string>;
  /** The WRAM image the static decoder reads this site's neighbours from. */
  image: string;
}

/** The sites in insertion order (the static extension's work order depends on it). */
type Sites = Map<number, Site>;

/** One oracle trace and the WRAM image it is paired with. */
interface TracePair {
  text: string;
  image: string;
}

/** xlat.py's command line, as data. */
interface XlatInput {
  name: string;
  rom: Uint8Array;
  traces: TracePair[];
  /** image name -> its 128 KB of WRAM. */
  images: Map<string, Uint8Array>;
  starts: Set<number>;
  stops: Set<number>;
}

export type { Site, Sites, TracePair, XlatInput };
