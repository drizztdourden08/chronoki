/* @layer bridge-wasm @kind constants */
import type { CtRegionSpec } from '../ct-region-spec.type';
import { DARK_AGES, END_OF_TIME, OCEAN_PALACE } from './dark-ages.constants';
import { BLACK_OMEN, LAVOS, UNSORTED } from './end-game.constants';
import { DEATH_PEAK, FUTURE } from './future.constants';
import { GIANTS_CLAW, MAGUS_CASTLE, MIDDLE_AGES } from './middle-ages.constants';
import { NORTHERN_RUINS, OZZIES_FORT } from './northern-ruins.constants';
import { PRESENT } from './present.constants';
import { PREHISTORY, TYRANO_LAIR } from './prehistory.constants';

const CT_REGIONS: readonly CtRegionSpec[] = [
  PRESENT, MIDDLE_AGES, GIANTS_CLAW, MAGUS_CASTLE, FUTURE, DEATH_PEAK, PREHISTORY, TYRANO_LAIR, END_OF_TIME,
  DARK_AGES, OCEAN_PALACE, BLACK_OMEN, LAVOS, UNSORTED, NORTHERN_RUINS, OZZIES_FORT,
];

export { CT_REGIONS };
