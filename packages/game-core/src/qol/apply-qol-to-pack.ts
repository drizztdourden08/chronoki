/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../randomizer/apply/apply-seed.type';
import { QOL_PACK_IDS, QOL_PACK_PLANNERS } from './qol-pack-planners.constants';
import type { QolPackId, QolResult } from './qol.type';

const staleOf = (pack: Uint8Array, edits: PackEdit[]): string[] =>
  edits.filter((e) => pack[e.at] !== e.old).map((e) => e.why);

const applyQolToPack = (pack: Uint8Array, enabled: ReadonlySet<QolPackId>): QolResult => {
  let bytes = pack;
  const applied: QolPackId[] = [];
  const skipped: QolResult['skipped'] = [];
  for (const id of QOL_PACK_IDS) {
    if (!enabled.has(id)) continue;
    const plan = QOL_PACK_PLANNERS[id](bytes);
    const why = [...plan.failed, ...staleOf(bytes, plan.edits)];
    if (why.length > 0) {
      skipped.push({ id, why });
      continue;
    }
    if (plan.edits.length > 0) {
      if (bytes === pack) bytes = pack.slice();
      plan.edits.forEach((e) => {
        bytes[e.at] = e.next;
      });
    }
    applied.push(id);
  }
  return { bytes, applied, skipped };
};

export { applyQolToPack };
