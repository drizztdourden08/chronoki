/* @layer shared-asset-extraction @kind types */

interface ScriptMem {
  g: Uint8Array;
  l: Uint8Array;
  s: Uint8Array;
  r8: (a: number) => number;
  w8: (a: number, v: number) => void;
  r16: (a: number) => number;
  w16: (a: number, v: number) => void;
}

export type { ScriptMem };
