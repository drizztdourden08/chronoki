/* @layer shared-asset-extraction @kind types */
import type { ImportContext } from './import-context.type';

type StageStatus = 'ported' | 'pending';

type StageGroupId = 'setup' | 'captures' | 'extract' | 'generate' | 'tail';

type StageNeed = 'oracle' | 'compile';

interface StageDef {
  id: string;
  label: string;
  python: string;
  group: StageGroupId;
  weight: number;
  status: StageStatus;
  step: boolean;
  needs: StageNeed[];
  after: string[];
}

type StageRun = (ctx: ImportContext) => Promise<void>;

interface ImportStage extends StageDef {
  run: StageRun | null;
}

export type { ImportStage, StageDef, StageGroupId, StageNeed, StageRun, StageStatus };
