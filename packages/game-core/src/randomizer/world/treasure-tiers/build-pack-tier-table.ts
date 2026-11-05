/* @layer bridge-wasm @kind logic */
import { createPackRomView } from '../../checks/create-pack-rom-view';
import { buildTierTable } from './build-tier-table';
import { readItemStats } from './read-item-stats';
import type { TierTable } from './treasure-tier.type';

const buildPackTierTable = (pack: Uint8Array): TierTable | null => {
  const view = createPackRomView(pack);
  const table = view ? buildTierTable(readItemStats(view)) : null;
  return table && table.slots.size > 0 ? table : null;
};

export { buildPackTierTable };
