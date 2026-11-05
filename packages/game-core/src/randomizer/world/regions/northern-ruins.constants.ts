/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';

const { all, has, option } = CT_KIT;

const NORTHERN_RUINS: CtRegionSpec = {
  id: 'northern-ruins',
  name: 'Northern Ruins (600 AD)',
  era: 'middle-ages',
  exits: [],
  spots: [
    {
      id: 'ki-cyrus-grave',
      name: "Cyrus's Grave",
      rule: all(option('addCyrusGraveSpot', true), has('frog')),
    },
  ],
  events: [],
  maps: [],
};

const OZZIES_FORT: CtRegionSpec = {
  id: 'ozzies-fort',
  name: "Ozzie's Fort (600 AD)",
  era: 'middle-ages',
  exits: [],
  spots: [{ id: 'ki-ozzies-fort', name: "Ozzie's Fort", rule: option('addOzzieSpot', true) }],
  events: [],
  maps: [],
};

export { NORTHERN_RUINS, OZZIES_FORT };
