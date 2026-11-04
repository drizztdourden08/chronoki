/* @layer shared-asset-extraction @kind types */
interface CtasDirEntry {
  type: number;
  id: number;
  offset: number;
  length: number;
}

interface CtasEntry {
  type: number;
  id: number;
  blob: Uint8Array;
}

interface CtasBuilder {
  add: (type: number, id: number, blob: Uint8Array) => void;
  addAll: (entries: Iterable<CtasEntry>) => void;
  count: () => number;
  countOfType: (type: number) => number;
  build: () => Uint8Array;
}

export type { CtasBuilder, CtasDirEntry, CtasEntry };
