/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../../randomizer/checks/check.type';
import { createPackRomView } from '../../randomizer/checks/create-pack-rom-view';
import type { RomView } from '../../randomizer/checks/create-pack-rom-view.type';
import { deriveChestChecks } from '../../randomizer/checks/derive-chest-checks';
import type { ChestMarker, ChestMarkers } from './chest-marker.type';
import { chestTierOf } from './chest-tier-of';

const markerOf = (rom: RomView, check: CheckDef): ChestMarker | null => {
  if (!check.tile || !check.probe) return null;
  const tier = chestTierOf(rom, check.vanillaItem);
  return tier === 0 ? null : { x: check.tile.x, y: check.tile.y, tier, opened: { offset: check.probe.offset, mask: check.probe.mask } };
};

const markersOfChecks = (rom: RomView, checks: readonly CheckDef[]): ChestMarkers => {
  const byLocation = new Map<number, ChestMarker[]>();
  checks.forEach((check) => {
    const marker = markerOf(rom, check);
    if (marker) byLocation.set(check.locationId, [...(byLocation.get(check.locationId) ?? []), marker]);
  });
  return byLocation;
};

const buildChestMarkers = (pack: Uint8Array): ChestMarkers => {
  const rom = createPackRomView(pack);
  return rom ? markersOfChecks(rom, deriveChestChecks(pack)) : new Map();
};

export { buildChestMarkers, markersOfChecks };
