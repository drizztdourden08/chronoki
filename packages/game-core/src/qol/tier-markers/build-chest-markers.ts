/* @layer bridge-wasm @kind logic */
import { createPackRomView } from '../../randomizer/checks/create-pack-rom-view';
import { deriveChestChecks } from '../../randomizer/checks/derive-chest-checks';
import type { ChestMarkers } from './chest-marker.type';
import { markersOfChecks } from './markers-of-checks';

const buildChestMarkers = (pack: Uint8Array): ChestMarkers => {
  const rom = createPackRomView(pack);
  return rom ? markersOfChecks(rom, deriveChestChecks(pack)) : new Map();
};

export { buildChestMarkers };
