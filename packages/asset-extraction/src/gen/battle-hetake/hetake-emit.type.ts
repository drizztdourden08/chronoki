/* @layer shared-asset-extraction @kind types */
interface Cell {
  dx: number;
  dy: number;
  tile: number;
  hf: number;
  vf: number;
}

interface Cluster {
  ax: number;
  ay: number;
  cells: Cell[];
}

interface HetakeTextOptions {
  idleV: Uint8Array;
  idleCg: Uint8Array;
  clusters: Cluster[];
  atkAsm: Cell[];
  atkV: Uint8Array;
  cursors: [number, number][];
}

export type { Cell, Cluster, HetakeTextOptions };
