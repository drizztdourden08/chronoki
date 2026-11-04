/* @layer shared-asset-extraction @kind types */
/** One directory record of a CTAS container: 16 bytes after the 12-byte header. */
interface CtasDirEntry {
  type: number;
  id: number;
  offset: number;
  length: number;
}

/** An entry as the packers yield it: (type, id, blob). */
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
  /** extract_assets.py build() tail: the container, offsets laid out once. */
  build: () => Uint8Array;
}

export type { CtasBuilder, CtasDirEntry, CtasEntry };
