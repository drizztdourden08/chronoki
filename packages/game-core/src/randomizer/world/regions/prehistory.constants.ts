/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';

const { has } = CT_KIT;

const PREHISTORY: CtRegionSpec = {
  id: 'prehistory',
  name: 'Prehistory (65,000,000 BC)',
  era: 'prehistory',
  exits: [{ to: 'end-of-time' }, { to: 'tyrano-lair', rule: has('dreamstone') }],
  spots: [{ id: 'ki-reptite-lair', name: 'Reptite Lair' }],
  events: [],
  maps: [0x110, 0x112, 0x115, 0x121, 0x124, 0x126, 0x127],
};

const TYRANO_LAIR: CtRegionSpec = {
  id: 'tyrano-lair',
  name: 'Tyrano Lair (65,000,000 BC)',
  era: 'prehistory',
  exits: [{ to: 'dark-ages' }, { to: 'ocean-palace', rule: has('ruby-knife') }],
  spots: [],
  events: [],
  maps: [0x12e, 0x130],
};

export { PREHISTORY, TYRANO_LAIR };
