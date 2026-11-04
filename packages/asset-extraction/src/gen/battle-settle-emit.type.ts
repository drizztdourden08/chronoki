/* @layer shared-asset-extraction @kind type */
interface SettleKf {
  name: string;
  n: number;
  pal: number;
  objOff: number;
  nObj: number;
  ax: number;
  ay: number;
  tiles: Uint8Array[];
}

export type { SettleKf };
