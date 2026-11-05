/* @layer bridge-wasm @kind type */
type BossSpot = {
  id: string;
  name: string;
  scenes: readonly number[];
  enemy: number;
  checkSpot?: string;
};

type BossAssignment = Readonly<Record<string, string>>;

type BossOp = { at: number; enemy: number; slot: number };

export type { BossAssignment, BossOp, BossSpot };
