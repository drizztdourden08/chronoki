/* @layer bridge-wasm @kind logic */
import { MENU_MP_REQS_BYTES, MENU_MP_REQS_ROM } from './tech-order.constants';
import type { TechIdMaps } from './tech-id-maps-of';
import type { RomSpace, RomStage } from './tech-order.type';

const planMenuMpEdits = (space: RomSpace, stage: RomStage, maps: TechIdMaps): string[] =>
  Array.from({ length: MENU_MP_REQS_BYTES }, (_, i) => MENU_MP_REQS_ROM + i).flatMap((addr) => {
    const id = space.read(addr);
    if (id === undefined) return [`tech-order: menu cost table ${addr.toString(16)} is not in the pack`];
    stage.put(addr, maps.newIdOf(id), 'tech-order: combination cost source');
    return [];
  });

export { planMenuMpEdits };
