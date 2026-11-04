/* @layer shared-asset-extraction @kind types */

interface DecodeOptions {
  pb?: string;
  namesub?: boolean;
  ind?: string;
}

interface TokenSource {
  subs: string[];
  length: number | null;
}

interface TokenState {
  rom: Uint8Array;
  o: number;
  out: string[];
  pb: string;
  namesub: boolean;
  ind: string;
  source: TokenSource;
}

type TokenHandler = (v: number, st: TokenState) => boolean | undefined;

export type { DecodeOptions, TokenSource, TokenState, TokenHandler };
