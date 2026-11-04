/* @layer bridge-wasm @kind constants */
import type { GameInfoSection } from '@drizztdourden08/brock-game-info';
import type { ChronokiInfoSnapshot } from '../game-info.type';
import { inventorySection } from './inventory-section';
import { locationSection } from './location-section';
import { musicSection } from './music-section';
import { partySection } from './party-section';
import { rawSection } from './raw-section';
import { storySection } from './story-section';
import { techsSection } from './techs-section';

const GAME_INFO_SECTIONS: readonly GameInfoSection<ChronokiInfoSnapshot>[] = [
  locationSection, partySection, storySection, inventorySection, techsSection, musicSection, rawSection,
];

export { GAME_INFO_SECTIONS };
