/* @layer shared-asset-extraction @kind types */

interface SceneExit {
  pos: [number, number];
  size: [number, number];
  kind: 'scene' | 'world';
  dest: number;
  dpos: [number, number];
  facing: number;
}

export type { SceneExit };
