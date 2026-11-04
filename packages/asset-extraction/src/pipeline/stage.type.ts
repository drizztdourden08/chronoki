/* @layer shared-asset-extraction @kind types */
import type { ImportContext } from './import-context.type';

type StageStatus = 'ported' | 'pending';

/** setup.py's phases, in its order. */
type StageGroupId = 'setup' | 'captures' | 'extract' | 'generate' | 'tail';

/** What a stage cannot run without: the emulator oracle (P3), or the compile-* packers (second half of P4). */
type StageNeed = 'oracle' | 'compile';

/** A stage as data: one step of setup.py, with the Python it maps to. */
interface StageDef {
  id: string;
  label: string;
  /** The Python file or function this stage ports (relative to tools/ or assets/). */
  python: string;
  group: StageGroupId;
  /** Relative cost, for the progress bar (about: a ROM read 1, an oracle capture 6, the 26-recipe replay 400). */
  weight: number;
  status: StageStatus;
  /** True for the 61 stages setup.py counts in "progress K/N". */
  step: boolean;
  needs: StageNeed[];
}

type StageRun = (ctx: ImportContext) => Promise<void>;

/** A def with its runner; `run` is null exactly when the status is 'pending'. */
interface ImportStage extends StageDef {
  run: StageRun | null;
}

export type { ImportStage, StageDef, StageGroupId, StageNeed, StageRun, StageStatus };
