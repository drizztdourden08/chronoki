/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';
import { STORY_STAGES } from '../story/story-stages.constants';
import { storyRuleOf } from '../story/story-rule-of';

const { all, has, helper, region } = CT_KIT;

const PRESENT: CtRegionSpec = {
  id: 'present',
  name: 'Present (1000 AD)',
  era: 'present',
  exits: [
    { to: 'middle-ages' },
    { to: 'future', rule: has('pendant') },
    { to: 'prehistory', rule: has('gate-key') },
  ],
  spots: [
    { id: 'ki-snail-stop', name: 'Snail Stop' },
    { id: 'ki-carpenters-wife', name: "Carpenter's Wife" },
    { id: 'ki-taban', name: 'Heckran Cave (Taban)', rule: storyRuleOf(STORY_STAGES.heckran) },
    { id: 'ki-kings-trial', name: "King's Trial", rule: has('kings-trial-done') },
    { id: 'ki-fionas-shrine', name: "Fiona's Shrine", rule: all(region('middle-ages'), has('robo')) },
    {
      id: 'ki-melchior-sun-stone',
      name: 'Melchior (Sun Stone)',
      rule: all(helper('sun-stone-charged'), has('kings-trial-done')),
    },
  ],
  events: [
    { id: 'kings-trial-done', rule: all(region('middle-ages'), has('prism-shard'), has('marle')) },
    { id: 'masamune', rule: all(has('bent-sword'), has('bent-hilt')) },
  ],
  maps: [
    0x001, 0x002, 0x004, 0x005, 0x008, 0x00c, 0x013, 0x014, 0x015, 0x01c, 0x01d, 0x02a, 0x02f, 0x032, 0x033, 0x035,
    0x039, 0x03d, 0x03f, 0x0c0, 0x1b2, 0x1b6, 0x1b7, 0x1b8, 0x1b9, 0x1e6,
  ],
};

export { PRESENT };
