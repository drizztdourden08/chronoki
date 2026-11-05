/* @layer bridge-wasm @kind type */
type EndingPoint = {
  scene: number;
  anchor: readonly number[];
  story: number;
  place: 'before' | 'after';
  why: string;
};

export type { EndingPoint };
