/* @layer bridge-wasm @kind logic */
import type { CharacterAssignment } from '../../world/recruits/character-assignment.type';
import type { EditPlan } from '../apply-seed.type';
import { planDuplicateNpcEdits } from './plan-duplicate-npc-edits';
import { planDuplicateRecordEdits } from './plan-duplicate-record-edits';

const planDuplicateKindEdits = (pack: Uint8Array, assignment: CharacterAssignment): EditPlan => {
  const plans = [planDuplicateRecordEdits(pack, assignment), planDuplicateNpcEdits(pack, assignment)];
  const failed = plans.flatMap((p) => p.failed);
  return failed.length > 0 ? { edits: [], failed } : { edits: plans.flatMap((p) => p.edits), failed };
};

export { planDuplicateKindEdits };
