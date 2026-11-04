/* @layer bridge-wasm @kind logic */
import { deriveChestChecks } from '../checks/derive-chest-checks';
import { deriveGiftChecks } from '../checks/derive-gift-checks';
import type { ApplyResult, PackEdit, Placement } from './apply-seed.type';
import { planChestEdits } from './plan-chest-edits';
import { planGiftEdits } from './plan-gift-edits';

const stale = (pack: Uint8Array, edits: PackEdit[]): string[] =>
  edits.filter((e) => pack[e.at] !== e.old).map((e) => e.why);

const applySeedToPack = (pack: Uint8Array, placement: Placement): ApplyResult => {
  const chests = deriveChestChecks(pack);
  const gifts = deriveGiftChecks(pack);
  const known = new Set([...chests, ...gifts].map((c) => c.id));
  const unknown = Object.keys(placement).filter((id) => !known.has(id));
  const chestPlan = planChestEdits(pack, chests, placement);
  const giftPlan = planGiftEdits(pack, gifts, placement);
  const edits = [...chestPlan.edits, ...giftPlan.edits];
  const failed = [...new Set([...unknown, ...chestPlan.failed, ...giftPlan.failed, ...stale(pack, edits)])];
  if (failed.length > 0) return { ok: false, failed };
  const bytes = pack.slice();
  edits.forEach((e) => {
    bytes[e.at] = e.next;
  });
  return { ok: true, bytes, edits: edits.length };
};

export { applySeedToPack };
