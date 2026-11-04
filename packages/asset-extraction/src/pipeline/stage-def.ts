/* @layer shared-asset-extraction @kind logic */
import type { StageDef } from './stage.type';
import type { StageArgs } from './stage-def.type';

const stage = ({ id, group, weight, status, python, label, needs = [], after = [] }: StageArgs): StageDef => ({
  id,
  label,
  python,
  group,
  weight,
  status,
  step: true,
  needs,
  after,
});

export { stage };
