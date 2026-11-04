/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';

const { all, has } = CT_KIT;

const MIDDLE_AGES: CtRegionSpec = {
  id: 'middle-ages',
  name: 'Middle Ages (600 AD)',
  era: 'middle-ages',
  exits: [
    { to: 'giants-claw', rule: has('tomas-pop') },
    { to: 'magus-castle', rule: all(has('masamune'), has('frog')) },
  ],
  spots: [
    { id: 'ki-zenan-bridge', name: 'Zenan Bridge' },
    { id: 'ki-denadoro-mts', name: 'Denadoro Mountains' },
    { id: 'ki-frogs-burrow', name: "Frog's Burrow (Hero Medal chest)", rule: has('hero-medal') },
  ],
  events: [{ id: 'frog' }],
  maps: [
    0x075, 0x077, 0x078, 0x07a, 0x081, 0x087, 0x08d, 0x08f, 0x095, 0x097, 0x09a, 0x09d, 0x09e, 0x0a1, 0x0bc, 0x0c2,
    0x0c6, 0x0c7, 0x1e0,
  ],
};

const GIANTS_CLAW: CtRegionSpec = {
  id: 'giants-claw',
  name: "Giant's Claw (600 AD)",
  era: 'middle-ages',
  exits: [],
  spots: [{ id: 'ki-giants-claw', name: "Giant's Claw" }],
  events: [],
  maps: [0x0c4, 0x0c5, 0x128],
};

const MAGUS_CASTLE: CtRegionSpec = {
  id: 'magus-castle',
  name: "Magus's Castle (600 AD)",
  era: 'middle-ages',
  exits: [{ to: 'dark-ages' }, { to: 'ocean-palace', rule: has('ruby-knife') }],
  spots: [],
  events: [],
  maps: [0x0a3, 0x0a4, 0x0a9, 0x0ac, 0x0ad, 0x0b1, 0x0b5, 0x0b7, 0x0b8, 0x1d7],
};

export { GIANTS_CLAW, MAGUS_CASTLE, MIDDLE_AGES };
