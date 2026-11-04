/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';

const { all, has } = CT_KIT;

const FUTURE: CtRegionSpec = {
  id: 'future',
  name: 'Future (2300 AD)',
  era: 'future',
  exits: [{ to: 'end-of-time' }, { to: 'death-peak', rule: all(has('c-trigger'), has('clone')) }],
  spots: [
    { id: 'ki-arris-dome', name: 'Arris Dome' },
    { id: 'ki-sun-palace', name: 'Sun Palace' },
    { id: 'ki-geno-dome', name: 'Geno Dome' },
  ],
  events: [{ id: 'robo' }],
  maps: [
    0x07e, 0x0d0, 0x0d2, 0x0d3, 0x0d6, 0x0d9, 0x0da, 0x0db, 0x0dc, 0x0e2, 0x0e3, 0x0e6, 0x0f2, 0x0f3, 0x0fb, 0x10c,
  ],
};

const DEATH_PEAK: CtRegionSpec = {
  id: 'death-peak',
  name: 'Death Peak (2300 AD)',
  era: 'future',
  exits: [{ to: 'black-omen' }],
  spots: [],
  events: [],
  maps: [0x0f5, 0x0f6, 0x0f7, 0x106, 0x107, 0x108, 0x109, 0x1ef],
};

export { DEATH_PEAK, FUTURE };
