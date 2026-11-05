/* @layer bridge-wasm @kind logic */
import type { Placement } from '../../apply/apply-seed.type';
import { CHEST_ID_PREFIX } from '../../checks/checks.constants';
import { createPackRomView } from '../../checks/create-pack-rom-view';
import { deriveChestChecks } from '../../checks/derive-chest-checks';
import { chestPayloadAddress } from './chest-payload-address';
import type { Mismatch } from './readback.type';

const compareChests = (pack: Uint8Array, placed: Placement): Mismatch[] => {
  const rom = createPackRomView(pack);
  const written = new Map(deriveChestChecks(pack).map((check) => [check.id, check.vanillaItem]));
  return Object.entries(placed)
    .filter(([id]) => id.startsWith(`${CHEST_ID_PREFIX}-`))
    .flatMap(([id, expected]): Mismatch[] => {
      const actual = written.get(id) ?? null;
      if (actual === expected) return [];
      return [{ kind: 'chest', location: id, expected, actual, address: rom ? chestPayloadAddress(rom, id) : -1 }];
    });
};

export { compareChests };
