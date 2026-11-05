/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../randomizer/apply/apply-seed.type';
import { spliceSceneScripts } from '../randomizer/apply/script/splice-scene-scripts';
import { QOL_PACK_IDS, QOL_PACK_PLANNERS } from './qol-pack-planners.constants';
import type { QolPackId, QolPlan, QolResult } from './qol.type';

const staleOf = (pack: Uint8Array, edits: PackEdit[]): string[] =>
  edits.filter((e) => pack[e.at] !== e.old).map((e) => e.why);

const withEdits = (bytes: Uint8Array, edits: PackEdit[]): Uint8Array => {
  if (edits.length === 0) return bytes;
  const next = bytes.slice();
  edits.forEach((e) => {
    next[e.at] = e.next;
  });
  return next;
};

const applyPlan = (bytes: Uint8Array, plan: QolPlan): { bytes: Uint8Array } | { why: string[] } => {
  const why = [...plan.failed, ...staleOf(bytes, plan.edits)];
  if (why.length > 0) return { why };
  const edited = withEdits(bytes, plan.edits);
  if (!plan.splices || plan.splices.length === 0) return { bytes: edited };
  const spliced = spliceSceneScripts(edited, plan.splices);
  return spliced.ok ? { bytes: spliced.bytes } : { why: spliced.failed };
};

const applyQolToPack = (pack: Uint8Array, enabled: ReadonlySet<QolPackId>): QolResult => {
  let bytes = pack;
  const applied: QolPackId[] = [];
  const skipped: QolResult['skipped'] = [];
  const notes: string[] = [];
  for (const id of QOL_PACK_IDS) {
    if (!enabled.has(id)) continue;
    const plan = QOL_PACK_PLANNERS[id](bytes);
    const result = applyPlan(bytes, plan);
    if ('why' in result) {
      skipped.push({ id, why: result.why });
      continue;
    }
    bytes = result.bytes;
    notes.push(...(plan.notes ?? []));
    applied.push(id);
  }
  return notes.length > 0 ? { bytes, applied, skipped, notes } : { bytes, applied, skipped };
};

export { applyQolToPack };
