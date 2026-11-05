/* @layer bridge-wasm @kind logic */
import type { Placement } from '../../apply/apply-seed.type';
import type { CheckDef } from '../../checks/check.type';
import { deriveGiftChecks } from '../../checks/derive-gift-checks';
import { CTAS_TYPE_SCRIPT, GIFT_ID_PREFIX } from '../../checks/gift-ops.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';
import type { Mismatch } from './readback.type';

const BASE_PARTS = 3;

const baseOf = (id: string): string => id.split('-').slice(0, BASE_PARTS).join('-');

const addressOf = (check: CheckDef | undefined, scripts: PackEntry[]): number => {
  const script = scripts.find((entry) => entry.id === check?.scriptId);
  const first = check?.patchAt?.[0];
  return script && first !== undefined ? script.start + first : -1;
};

const compareGifts = (pack: Uint8Array, placed: Placement): Mismatch[] => {
  const written = deriveGiftChecks(pack);
  const scripts = readPackEntries(pack).filter((entry) => entry.type === CTAS_TYPE_SCRIPT);
  return Object.entries(placed)
    .filter(([id]) => id.startsWith(`${GIFT_ID_PREFIX}-`))
    .flatMap(([id, expected]): Mismatch[] => {
      const found = written.find((check) => check.id === id) ?? written.find((check) => check.id === baseOf(id));
      if (found?.vanillaItem === expected) return [];
      return [{ kind: 'gift', location: id, expected, actual: found?.vanillaItem ?? null, address: addressOf(found, scripts) }];
    });
};

export { compareGifts };
