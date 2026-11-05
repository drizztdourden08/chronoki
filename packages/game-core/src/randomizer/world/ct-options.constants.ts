/* @layer bridge-wasm @kind constants */
import type { CtOptionDef } from './ct-option-def.type';
import { BUCKET_OPTIONS } from './bucket/bucket-options.constants';
import { CT_DEFAULT_MODE, CT_MODES } from './modes/ct-modes.constants';
import {
  MYSTERY_ENEMY_DIFFICULTY, MYSTERY_GAME_MODE, MYSTERY_ITEM_DIFFICULTY, MYSTERY_SHOP_PRICES, MYSTERY_TECH_ORDER,
} from './mystery/mystery-weights.constants';
import { TAB_RANGE_OPTIONS } from './tabs/tab-range-options.constants';

const CT_OPTION_CATALOG: readonly CtOptionDef[] = [
  {
    key: 'gameMode', label: 'Game mode', jotFlag: 'mode', default: CT_DEFAULT_MODE,
    choices: CT_MODES.filter((mode) => mode.implemented).map((mode) => mode.id),
    section: 'Game', implemented: true, mystery: MYSTERY_GAME_MODE,
    choiceLabels: Object.fromEntries(CT_MODES.filter((mode) => mode.implemented).map((mode) => [mode.id, mode.label])),
  },
  {
    key: 'itemDifficulty', label: 'Item difficulty', jotFlag: 'e/n/h', default: 'normal', choices: ['easy', 'normal', 'hard'],
    section: 'Difficulty', implemented: true, mystery: MYSTERY_ITEM_DIFFICULTY, choiceLabels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  },
  {
    key: 'enemyDifficulty', label: 'Enemy difficulty', jotFlag: 'n/h', default: 'normal', choices: ['normal', 'hard'],
    section: 'Difficulty', implemented: true, mystery: MYSTERY_ENEMY_DIFFICULTY, choiceLabels: { normal: 'Normal', hard: 'Hard' },
  },
  { key: 'bossScaling', label: 'Boss scaling', jotFlag: 'b', default: false, section: 'Difficulty', implemented: true, mystery: 0.35 },
  {
    key: 'shopPrices', label: 'Shop prices', jotFlag: 'shop', default: 'normal',
    choices: ['normal', 'free', 'mostly-random', 'fully-random'], section: 'Randomization', implemented: true, mystery: MYSTERY_SHOP_PRICES,
    choiceLabels: { normal: 'Normal', free: 'Free', 'mostly-random': 'Mostly random', 'fully-random': 'Fully random' },
  },
  { key: 'bossRando', label: 'Boss randomization', jotFlag: 'ro', default: false, section: 'Randomization', implemented: true, mystery: 0.4 },
  {
    key: 'characterRando', label: 'Character randomization', jotFlag: 'chars', default: false, section: 'Randomization', implemented: true, mystery: 0.3,
    hint: 'Recruit spots hand out a different character; each keeps their own identity.',
  },
  {
    key: 'duplicateCharacters', label: 'Duplicate characters', jotFlag: 'dupchars', default: false, section: 'Randomization', implemented: true,
    hint: 'Only with character randomization: a recruit spot can hand out a kind you already have.',
  },
  {
    key: 'duplicateCap', label: 'Copies per character', jotFlag: '-', default: 'none', choices: ['none', '2', '3'],
    section: 'Randomization', implemented: true, hint: 'Only with duplicate characters: the most copies of one character in the party of 7.',
    choiceLabels: { none: 'No limit', '2': 'At most 2', '3': 'At most 3' },
  },
  {
    key: 'duplicateAllSlots', label: 'Duplicates on Crono and Magus', jotFlag: '-', default: false, section: 'Randomization', implemented: true,
    hint: 'Only with duplicate characters: Crono and Magus can also turn into another character.',
  },
  { key: 'disableGlitches', label: 'Disable glitches', jotFlag: 'g', default: false, section: 'Rules', implemented: true, mystery: 0.25 },
  { key: 'earlyPendantCharge', label: 'Early pendant charge', jotFlag: 'p', default: false, section: 'Rules', implemented: true, mystery: 0.3 },
  { key: 'unlockedMagic', label: 'Unlocked magic', jotFlag: 'm', default: false, section: 'Rules', implemented: true, mystery: 0.3 },
  { key: 'lockedCharacters', label: 'Locked characters', jotFlag: 'c', default: false, section: 'Rules', implemented: true, mystery: 0.25 },
  { key: 'addCyrusGraveSpot', label: "Add Cyrus's Grave spot", jotFlag: 'cyrus', default: false, section: 'Rules', implemented: true, mystery: 0.3 },
  { key: 'addOzzieSpot', label: "Add Ozzie's Fort spot", jotFlag: 'ozzie', default: false, section: 'Rules', implemented: true, mystery: 0.3 },
  {
    key: 'vanillaRoboRibbon', label: 'Vanilla Robo Ribbon', jotFlag: 'ribbon', default: true, frozen: true, section: 'Rules', implemented: true,
    hint: "Always on: the game has no ribbon item, Atropos raises Robo's stats in Geno Dome as in vanilla.",
  },
  {
    key: 'techOrder', label: 'Tech order', jotFlag: 'tech', default: 'normal', choices: ['normal', 'balanced-random', 'full-random'],
    section: 'Rules', implemented: true, mystery: MYSTERY_TECH_ORDER,
    choiceLabels: { normal: 'Normal', 'balanced-random': 'Balanced random', 'full-random': 'Full random' },
  },
  { key: 'gearRando', label: 'Gear randomization', jotFlag: 'gear', default: false, section: 'Randomization', implemented: true, mystery: 0.4 },
  { key: 'healingRando', label: 'Healing item randomization', jotFlag: 'heal', default: false, section: 'Randomization', implemented: true, mystery: 0.4 },
  { key: 'techDamageRando', label: 'Tech damage randomization', jotFlag: 'tech-damage', default: false, section: 'Randomization', implemented: true, mystery: 0.35 },
  { key: 'elementRando', label: 'Element randomization', jotFlag: 'element', default: false, section: 'Randomization', implemented: true, mystery: 0.35 },
  { key: 'epochFail', label: 'Epoch fail', jotFlag: 'epochFail', default: false, section: 'Rules', implemented: true, mystery: 0.25 },
  {
    key: 'partyMode', label: 'Starting party', jotFlag: '-', default: 'random', choices: ['random', 'custom'],
    section: 'Party', implemented: true, choiceLabels: { random: 'Random', custom: 'Choose' },
  },
  { key: 'partySize', label: 'Random party size', jotFlag: '-', default: 2, choices: [1, 2, 3, 4, 5, 6, 7], section: 'Party', implemented: true },
  { key: 'startingParty', label: 'Party', jotFlag: '-', default: 'crono,marle', section: 'Party', implemented: true },
  { key: 'mysterySeed', label: 'Mystery seed', jotFlag: 'mystery', default: false, section: 'Randomization', implemented: true,
    hint: 'The seed rolls the other options; the rolled values stay hidden until you open the spoiler.' },
  { key: 'tabsanity', label: 'Tabsanity', jotFlag: 'tab', default: false, section: 'Tabs', implemented: true, mystery: 0.3 },
  {
    key: 'chronosanity', label: 'Chronosanity', jotFlag: 'cr', default: false, section: 'Randomization', implemented: true, mystery: 0.3,
    hint: 'Key items can be in any treasure chest, not only the key-item spots.',
  },
  ...BUCKET_OPTIONS,
  ...TAB_RANGE_OPTIONS,
];

export { CT_OPTION_CATALOG };
