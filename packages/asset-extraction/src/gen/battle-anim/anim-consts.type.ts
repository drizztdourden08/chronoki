/* @layer shared-asset-extraction @kind types */
interface Key {
  driver: 'mash' | 'hold';
  pal: number;
  name: string;
  pose: string;
  repFrame: number;
  startF: number;
  endF: number;
}

export type { Key };
