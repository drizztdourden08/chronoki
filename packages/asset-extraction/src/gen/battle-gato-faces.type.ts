/* @layer shared-asset-extraction @kind type */
interface Baked {
  name: string;
  facing: number;
  rel: { rx: number; ry: number; tile: number }[];
  tiles: Uint8Array[];
  md5: string;
}

export type { Baked };
