/* @layer bridge-wasm @kind constants */
import type { CtOptionDoc } from './ct-option-docs.type';
import type { CtOptionKey } from './ct-world-keys.type';
import { TAB_DOCS } from './tabs/tab-docs.constants';

const OBJECTIVE_RANGE = { min: 1, max: 8 };

const CT_OPTION_DOCS: Readonly<Record<CtOptionKey, CtOptionDoc>> = {
  gameMode: { group: 'Mode', description: 'The goal and layout of the run: the game mode the seed is rolled for.' },
  itemDifficulty: { group: 'Items', description: 'How generous the item pool is: easy, normal or hard.' },
  enemyDifficulty: { group: 'Enemies', description: 'Normal keeps the enemies as in the original game. Hard makes them tougher.' },
  bossScaling: { group: 'Enemies', description: 'Bosses scale with how far the run has progressed instead of staying fixed.' },
  shopPrices: { group: 'Shops', description: 'Normal keeps the original prices. Free makes everything cost nothing; the random modes shuffle prices, mostly or fully.' },
  bossRando: { group: 'Bosses', description: 'Bosses appear in each other\'s places, so a fight can be a different boss than the story expects.' },
  characterRando: { group: 'Characters', description: 'Recruit spots hand out a different character; each keeps their own identity.' },
  duplicateCharacters: { group: 'Characters', description: 'Only with character randomization: a recruit spot can hand out a kind you already have.' },
  duplicateCap: { group: 'Characters', description: 'Only with duplicate characters: the most copies of one character in the party of 7.' },
  duplicateAllSlots: { group: 'Characters', description: 'Only with duplicate characters: Crono and Magus can also turn into another character.' },
  gearRando: { group: 'Equipment', description: 'Weapons, armor and accessories are shuffled among their spots.' },
  healingRando: { group: 'Equipment', description: 'Healing items are shuffled among their spots.' },
  techDamageRando: { group: 'Techs', description: 'The damage of each tech is randomized.' },
  elementRando: { group: 'Techs', description: 'The element of each tech is randomized.' },
  techOrder: { group: 'Techs', description: 'The order in which each character learns techs: the original, a balanced shuffle, or a full shuffle.' },
  chronosanity: { group: 'Key items', description: 'Key items can be in any treasure chest, not only the key-item spots.' },
  mysterySeed: { group: 'Seed', description: 'The seed rolls the other options; the rolled values stay hidden until you open the spoiler.' },
  disableGlitches: { group: 'Logic', description: 'The logic no longer expects glitches to reach a spot.' },
  epochFail: { group: 'Logic', description: 'The logic counts the Epoch fail as a way to reach places.' },
  earlyPendantCharge: { group: 'Progress', description: 'The Pendant is charged earlier, so what it opens is reachable sooner.' },
  unlockedMagic: { group: 'Progress', description: 'Magic is available from the start instead of after the story unlocks it.' },
  lockedCharacters: { group: 'Progress', description: 'Characters stay locked behind their recruit spots in the logic.' },
  vanillaRoboRibbon: { group: 'Progress', description: 'The Robo Ribbon stays where the original game puts it.' },
  addCyrusGraveSpot: { group: 'Extra spots', description: 'Adds Cyrus\'s Grave as a spot that can hold an item.' },
  addOzzieSpot: { group: 'Extra spots', description: 'Adds Ozzie\'s Fort as a spot that can hold an item.' },
  partyMode: { group: 'Party', description: 'Random lets the seed pick the starting party; Choose lets you pick it.' },
  partySize: { group: 'Party', description: 'With a random party: how many characters the seed picks to start with.', kind: 'range', range: { min: 1, max: 7 } },
  startingParty: { group: 'Party', description: 'With a chosen party: who starts, in order. The first three are active, the rest wait in reserve.' },
  bucketList: { group: 'Bucket List', description: 'Complete enough objectives and the End of Time bucket opens to Lavos.' },
  objectiveCount: { group: 'Bucket List', description: 'How many objectives the seed gives you.', kind: 'range', range: OBJECTIVE_RANGE },
  objectivesNeeded: { group: 'Bucket List', description: 'How many of the objectives must be done to open the bucket.', kind: 'range', range: OBJECTIVE_RANGE },
  ...TAB_DOCS,
};

export { CT_OPTION_DOCS };
