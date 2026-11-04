/* @layer shared-asset-extraction @kind types */

interface SceneProps {
  w: number;
  h: number;
  coll: number[];
  zplane: number[];
  zflags: number[];
  mover: number[];
}

type Planes = Pick<SceneProps, 'coll' | 'zplane' | 'zflags' | 'mover'>;

export type { SceneProps, Planes };
