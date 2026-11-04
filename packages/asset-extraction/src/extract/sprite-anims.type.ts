/* @layer shared-asset-extraction @kind types */

interface AnimTables {
  fp: number[];
  dp: number[];
}

interface AssemblyFrame {
  chips: number[];
  offs: [number, number][];
  units: number;
}

export type { AnimTables, AssemblyFrame };
