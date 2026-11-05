/* @layer bridge-wasm @kind constants */
import type { CtOptionDef } from '../ct-option-def.type';

const OBJECTIVE_CHOICES: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8];

const BUCKET_OPTIONS: readonly CtOptionDef[] = [
  {
    key: 'bucketList', label: 'Bucket List', jotFlag: 'bucket', default: false, section: 'Objectives', implemented: true,
    hint: 'Complete enough objectives and the End of Time bucket opens to Lavos.',
  },
  { key: 'objectiveCount', label: 'Objectives', jotFlag: '-', default: 5, choices: OBJECTIVE_CHOICES, section: 'Objectives', implemented: true },
  { key: 'objectivesNeeded', label: 'Objectives needed', jotFlag: '-', default: 4, choices: OBJECTIVE_CHOICES, section: 'Objectives', implemented: true },
];

export { BUCKET_OPTIONS };
