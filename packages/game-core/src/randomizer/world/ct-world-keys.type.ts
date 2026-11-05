/* @layer bridge-wasm @kind type */
type CtKeyItem =
  | 'gate-key' | 'pendant' | 'dreamstone' | 'ruby-knife' | 'c-trigger' | 'clone' | 'bent-sword' | 'bent-hilt'
  | 'hero-medal' | 'prism-shard' | 'moon-stone' | 'tomas-pop' | 'jerky' | 'grand-leon' | 'robo-ribbon'
  | 'jets-of-time';

type CtBaseKeyItem = Exclude<CtKeyItem, 'jets-of-time'>;

type CtTreasureItem = `treasure-${string}`;

type CtItem = CtKeyItem | CtTreasureItem;

type CtCharacter = 'crono' | 'marle' | 'lucca' | 'robo' | 'frog' | 'ayla' | 'magus';

type CtEventId = CtCharacter | 'masamune' | 'kings-trial-done' | 'beat-lavos'
  | 'beat-ozzie' | 'cyrus-done' | 'beat-giga-gaia';

type CtEra = 'present' | 'middle-ages' | 'future' | 'prehistory' | 'dark-ages' | 'end-of-time' | 'none';

type CtRegionId =
  | 'present' | 'middle-ages' | 'giants-claw' | 'magus-castle' | 'future' | 'death-peak' | 'black-omen'
  | 'prehistory' | 'tyrano-lair' | 'end-of-time' | 'dark-ages' | 'ocean-palace' | 'lavos' | 'unsorted'
  | 'northern-ruins' | 'ozzies-fort';

type CtSpotId =
  | 'ki-zenan-bridge' | 'ki-denadoro-mts' | 'ki-frogs-burrow' | 'ki-giants-claw' | 'ki-kings-trial'
  | 'ki-fionas-shrine' | 'ki-snail-stop' | 'ki-carpenters-wife' | 'ki-taban' | 'ki-melchior-sun-stone'
  | 'ki-reptite-lair' | 'ki-arris-dome' | 'ki-sun-palace' | 'ki-geno-dome' | 'ki-mt-woe'
  | 'ki-sunken-desert' | 'ki-cyrus-grave' | 'ki-ozzies-fort';

type CtHelperName = 'sun-stone-charged' | 'go-mode' | 'sealed-open';

type CtOptionKey =
  | 'gameMode' | 'itemDifficulty' | 'enemyDifficulty' | 'disableGlitches' | 'bossScaling' | 'earlyPendantCharge'
  | 'unlockedMagic' | 'lockedCharacters' | 'addCyrusGraveSpot' | 'addOzzieSpot' | 'vanillaRoboRibbon'
  | 'partyMode' | 'partySize' | 'startingParty' | 'epochFail' | 'shopPrices' | 'tabsanity'
  | 'chronosanity'
  | 'powerTabMin' | 'powerTabMax' | 'magicTabMin' | 'magicTabMax' | 'speedTabMin' | 'speedTabMax';

type CtWorldKeys = {
  item: CtItem;
  location: string;
  region: CtRegionId;
  event: CtEventId;
  holding: CtItem | CtEventId;
  helper: CtHelperName;
  option: CtOptionKey;
};

export type {
  CtBaseKeyItem, CtCharacter, CtEra, CtEventId, CtHelperName, CtItem, CtKeyItem, CtOptionKey, CtRegionId, CtSpotId, CtTreasureItem,
  CtWorldKeys,
};
