/* @layer bridge-wasm @kind logic */
import type { Placement } from '../../apply/apply-seed.type';
import type { CheckDef } from '../../checks/check.type';
import { CTAS_TYPE_SCRIPT, GIFT_ID_PREFIX } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';
import type { Mismatch } from './readback.type';

type GiftProbe = { id: string; expected: number; spots: number[]; script?: PackEntry };

const giftMismatch = (pack: Uint8Array, { id, expected, spots, script }: GiftProbe): Mismatch[] => {
  if (!script || spots.length === 0) return [{ kind: 'gift', location: id, expected, actual: null, address: -1 }];
  const wrong = spots.map((p) => script.start + p).find((at) => pack[at] !== expected);
  if (wrong === undefined) return [];
  return [{ kind: 'gift', location: id, expected, actual: pack[wrong] ?? null, address: wrong }];
};

const compareGifts = (pack: Uint8Array, placed: Placement, checks: readonly CheckDef[]): Mismatch[] => {
  const byId = new Map(checks.map((check) => [check.id, check]));
  const scripts = new Map(readPackEntries(pack).filter((e) => e.type === CTAS_TYPE_SCRIPT).map((e) => [e.id, e]));
  return Object.entries(placed)
    .filter(([id]) => id.startsWith(`${GIFT_ID_PREFIX}-`))
    .flatMap(([id, expected]) => {
      const check = byId.get(id);
      const script = check?.scriptId === undefined ? undefined : scripts.get(check.scriptId);
      return giftMismatch(pack, { id, expected, spots: check?.patchAt ?? [], script });
    });
};

export { compareGifts };
