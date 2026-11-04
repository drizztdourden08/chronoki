/* @layer shared-asset-extraction @kind types */

interface LocationIndices {
  ts: Set<number>;
  b3s: Set<number>;
  idxs: Set<number>;
  maps: Set<number>;
  scripts: Set<number>;
}

export type { LocationIndices };
