/* @layer shared-asset-extraction @kind types */

type XlatState = { recipe: string } | { peekFrom: string; script: string; env: Record<string, string> };

interface XlatTrace {
  name: string;
  state: string;
  frames: number;
  env: Record<string, string>;
}

interface XlatProgram {
  states: Record<string, XlatState>;
  traces: XlatTrace[];
  images: Record<string, { state: string; script: string }>;
  family?: [number, number];
  pairs: Array<[string, string]>;
  froms: string[];
  stops: string[];
}

export type { XlatProgram, XlatState, XlatTrace };
