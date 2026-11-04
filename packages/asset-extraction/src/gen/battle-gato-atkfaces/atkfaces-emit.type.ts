/* @layer shared-asset-extraction @kind types */
interface Pose {
  label: string;
  rel: { rx: number; ry: number; tile: number }[];
  tiles: Uint8Array[];
  md5: string;
}

interface Face {
  name: string;
  facing: number;
  strikeAt: number;
  rear: number;
  strike: number;
}

export type { Pose, Face };
