/* @layer shared-asset-extraction @kind types */

/** A state: a recipe's, or derived by one --peek run from another state of the program (xlat_all 'peek'). */
type XlatState = { recipe: string } | { peekFrom: string; script: string; env: Record<string, string> };

/** A `ct.exe --cputrace` run (CPUTRACE_UNIQUE=1 is added by the runner). */
interface XlatTrace {
  name: string;
  state: string;
  frames: number;
  env: Record<string, string>;
}

/** One translated ROM program, as xlat_all.PROGRAMS describes it. */
interface XlatProgram {
  states: Record<string, XlatState>;
  traces: XlatTrace[];
  /** image name -> the --peek run whose .raw.wram the static extension decodes from. */
  images: Record<string, { state: string; script: string }>;
  /** The family's own lines (address range) out of every trace, each first seen once, as a trace of its own. */
  family?: [number, number];
  /** (trace, image) pairs, in tools/gen/xlat.py's argument order. */
  pairs: Array<[string, string]>;
  froms: string[];
  stops: string[];
}

export type { XlatProgram, XlatState, XlatTrace };
