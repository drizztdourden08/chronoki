/* @layer bridge-wasm @kind constants */
import type { CtRegionSpec } from '../ct-region-spec.type';

const BLACK_OMEN: CtRegionSpec = {
  id: 'black-omen',
  name: 'Black Omen',
  era: 'none',
  exits: [{ to: 'lavos' }],
  spots: [],
  events: [],
  maps: [0x060, 0x064, 0x065, 0x136, 0x143, 0x145, 0x1c2, 0x1c3],
};

const LAVOS: CtRegionSpec = {
  id: 'lavos',
  name: 'Lavos',
  era: 'none',
  exits: [{ to: 'unsorted' }],
  spots: [],
  events: [{ id: 'beat-lavos' }],
  maps: [],
};

const UNSORTED: CtRegionSpec = {
  id: 'unsorted',
  name: 'Unsorted treasure',
  era: 'none',
  exits: [],
  spots: [],
  events: [],
  maps: [],
};

export { BLACK_OMEN, LAVOS, UNSORTED };
