/* @layer bridge-wasm @kind constants */
import { CT_KIT } from './ct-kit.constants';
import type { PinnedSource } from './pinned-source.type';
import { STORY_STAGES } from './story/story-stages.constants';
import { storyRuleOf } from './story/story-rule-of';

const { all, has, region } = CT_KIT;

const PINNED_SOURCES: readonly PinnedSource[] = [
  {
    key: 'gift-1d0-o0',
    item: 'c-trigger',
    region: 'end-of-time',
    mapId: 0x1d0,
    name: 'Gaspar (Chrono Trigger)',
    rule: storyRuleOf(STORY_STAGES.oceanPalace),
    needs: ['end-of-time', 'ocean-palace'],
  },
  {
    key: 'gift-1b8-o2',
    item: 'prism-shard',
    region: 'present',
    mapId: 0x1b8,
    name: 'Guardia Castle (Prism Shard)',
    rule: all(region('giants-claw'), has('marle')),
    needs: ['present', 'giants-claw'],
  },
];

export { PINNED_SOURCES };
