/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import { flagObjective } from './flag-objective';
import type { ObjectiveDef } from './objective-def.type';

const { all, has, helper, region } = CT_KIT;

const AFTER = false;
const BEFORE = true;

const FLAG_OBJECTIVES: readonly ObjectiveDef[] = [
  flagObjective({ id: 'heckran', label: 'Beat Heckran', kind: 'boss', at: 0x01a3, mask: 0x02, settle: AFTER, regions: ['present'], rule: region('present') }),
  flagObjective({ id: 'dragon-tank', label: 'Beat the Dragon Tank', kind: 'boss', at: 0x0199, mask: 0x04, settle: BEFORE, regions: ['present'], rule: region('present') }),
  flagObjective({
    id: 'kings-trial', label: "Clear the King's Trial", kind: 'quest', at: 0x0050, mask: 0x80, settle: AFTER,
    regions: ['present', 'middle-ages'], rule: has('kings-trial-done'),
  }),
  flagObjective({ id: 'masa-mune', label: 'Beat Masa and Mune', kind: 'boss', at: 0x01f3, mask: 0x10, settle: BEFORE, regions: ['middle-ages'], rule: region('middle-ages') }),
  flagObjective({ id: 'slash', label: 'Beat Slash', kind: 'boss', at: 0x00a3, mask: 0x04, settle: BEFORE, regions: ['magus-castle'], rule: region('magus-castle') }),
  flagObjective({ id: 'flea', label: 'Beat Flea', kind: 'boss', at: 0x00a3, mask: 0x08, settle: AFTER, regions: ['magus-castle'], rule: region('magus-castle') }),
  flagObjective({
    id: 'ozzie-castle', label: "Beat Ozzie at Magus's Castle", kind: 'boss', at: 0x00ac, mask: 0x10, settle: AFTER,
    regions: ['magus-castle'], rule: region('magus-castle'),
  }),
  flagObjective({
    id: 'retinite', label: 'Beat Retinite', kind: 'boss', at: 0x01a3, mask: 0x01, settle: AFTER,
    regions: ['middle-ages', 'future'], rule: all(region('middle-ages'), has('robo')),
  }),
  flagObjective({ id: 'giants-claw', label: "Clear the Giant's Claw", kind: 'quest', at: 0x01d2, mask: 0x20, settle: AFTER, regions: ['giants-claw'], rule: region('giants-claw') }),
  flagObjective({ id: 'rust-tyrano', label: 'Beat Rust Tyrano', kind: 'boss', at: 0x01d2, mask: 0x40, settle: BEFORE, regions: ['giants-claw'], rule: region('giants-claw') }),
  flagObjective({ id: 'guardian', label: 'Beat the Guardian', kind: 'boss', at: 0x00ec, mask: 0x01, settle: BEFORE, regions: ['future'], rule: region('future') }),
  flagObjective({ id: 'son-of-sun', label: 'Beat Son of Sun', kind: 'boss', at: 0x013a, mask: 0x01, settle: AFTER, regions: ['future'], rule: region('future') }),
  flagObjective({
    id: 'sun-stone', label: 'Charge the Sun Stone', kind: 'quest', at: 0x013a, mask: 0x40, settle: AFTER,
    regions: ['future', 'prehistory'], items: ['moon-stone'], rule: helper('sun-stone-charged'),
  }),
  flagObjective({ id: 'mother-brain', label: 'Beat Mother Brain', kind: 'boss', at: 0x013b, mask: 0x10, settle: AFTER, regions: ['future'], rule: region('future') }),
  flagObjective({ id: 'atropos', label: 'Beat Atropos XR', kind: 'boss', at: 0x014b, mask: 0x02, settle: BEFORE, regions: ['future'], rule: region('future') }),
  flagObjective({ id: 'nizbel-ii', label: 'Beat Nizbel II', kind: 'boss', at: 0x00ee, mask: 0x01, settle: BEFORE, regions: ['tyrano-lair'], rule: region('tyrano-lair') }),
  flagObjective({ id: 'black-tyrano', label: 'Beat Black Tyrano', kind: 'boss', at: 0x00ec, mask: 0x80, settle: AFTER, regions: ['tyrano-lair'], rule: region('tyrano-lair') }),
  flagObjective({ id: 'great-ozzie', label: 'Beat Great Ozzie', kind: 'boss', at: 0x01a1, mask: 0x80, settle: AFTER, regions: ['ozzies-fort'], rule: region('ozzies-fort') }),
  flagObjective({ id: 'giga-gaia', label: 'Beat Giga Gaia', kind: 'boss', at: 0x01a0, mask: 0x10, settle: AFTER, regions: ['dark-ages'], rule: region('dark-ages') }),
  flagObjective({
    id: 'magus-north-cape', label: 'Face Magus at the North Cape', kind: 'boss', at: 0x0138, mask: 0x02, settle: AFTER,
    regions: ['magus-castle', 'middle-ages', 'future'], rule: all(region('magus-castle'), has('frog')),
  }),
  flagObjective({
    id: 'cyrus-grave', label: "Visit Cyrus's Grave", kind: 'quest', at: 0x01a3, mask: 0x40, settle: AFTER,
    regions: ['northern-ruins', 'middle-ages'], items: ['hero-medal', 'grand-leon'],
    rule: all(region('northern-ruins'), has('frog'), has('hero-medal'), has('grand-leon')),
  }),
  flagObjective({
    id: 'jerky', label: 'Turn in the Jerky', kind: 'quest', at: 0x00a7, mask: 0x04, settle: AFTER,
    regions: ['middle-ages'], items: ['jerky'], rule: all(region('middle-ages'), has('jerky')),
  }),
  flagObjective({
    id: 'epoch-flight', label: 'Find the Jets of Time', kind: 'quest', at: 0x0294, mask: 0x20, settle: AFTER, bank7e: true,
    regions: [], rule: has('jets-of-time'), option: 'epochFail',
  }),
];

export { FLAG_OBJECTIVES };
