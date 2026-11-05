/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { StoryWriter } from './story-writer.type';
import { STORY_STAGES } from './story-stages.constants';

const { all, has, option, region, when } = CT_KIT;

const STORY_WRITERS: readonly StoryWriter[] = [
  { stage: STORY_STAGES.heckran, scene: 0x02f, rule: region('present') },
  { stage: STORY_STAGES.masamune, scene: 0x028, rule: has('masamune') },
  { stage: STORY_STAGES.darkAges, scene: 0x14b, rule: region('dark-ages') },
  {
    stage: STORY_STAGES.keepersDome,
    scene: 0x0f3,
    rule: all(region('future'), when(option('epochFail', true), has('jets-of-time'), all())),
  },
  { stage: STORY_STAGES.oceanPalace, scene: 0x1a3, rule: region('ocean-palace') },
];

export { STORY_WRITERS };
