/* @layer bridge-wasm @kind logic */
import type { ImpactCell } from '@drizztdourden08/brock-randomizer/renderer';
import { NOTE_LABEL } from './ct-impact-cell.constants';
import type { CtPoolImpact } from './ct-pool-impact.type';
import { signedCount } from './signed-count';

const ctImpactCell = (impact: CtPoolImpact): ImpactCell => (impact.note !== ''
  ? { text: NOTE_LABEL[impact.note] ?? impact.note, muted: true }
  : {
    text: `${signedCount(impact.locations)} loc · ${signedCount(impact.items)} items`,
    muted: impact.locations === 0 && impact.items === 0,
  });

export { ctImpactCell };
