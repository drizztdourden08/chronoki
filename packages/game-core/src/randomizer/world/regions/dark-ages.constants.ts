/* @layer bridge-wasm @kind constants */
import type { CtRegionSpec } from '../ct-region-spec.type';

const END_OF_TIME: CtRegionSpec = {
  id: 'end-of-time',
  name: 'End of Time',
  era: 'end-of-time',
  exits: [{ to: 'dark-ages' }],
  spots: [],
  events: [],
  maps: [0x1d0, 0x1d1],
};

const DARK_AGES: CtRegionSpec = {
  id: 'dark-ages',
  name: 'Dark Ages (12,000 BC)',
  era: 'dark-ages',
  exits: [],
  spots: [{ id: 'ki-mt-woe', name: 'Mt. Woe' }],
  events: [],
  maps: [0x06e, 0x149, 0x14e, 0x167, 0x18d],
};

const OCEAN_PALACE: CtRegionSpec = {
  id: 'ocean-palace',
  name: 'Ocean Palace (12,000 BC)',
  era: 'dark-ages',
  exits: [{ to: 'lavos' }],
  spots: [],
  events: [],
  maps: [0x194, 0x19e],
};

export { DARK_AGES, END_OF_TIME, OCEAN_PALACE };
