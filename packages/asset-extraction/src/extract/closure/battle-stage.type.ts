/* @layer shared-asset-extraction @kind types */

type StageCfg = [number, number, number, number, number, number];

interface StageAdd {
  stride: number;
  first: number;
  d1: number;
  t2: number;
  t3: number;
}

export type { StageCfg, StageAdd };
