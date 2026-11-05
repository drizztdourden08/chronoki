/* @layer bridge-wasm @kind constants */
import type { CtItem, CtSpotId } from './ct-world-keys.type';

const SPOT_VANILLA_ITEMS: Readonly<Record<CtSpotId, CtItem>> = {
  'ki-kings-trial': 'pendant',
  'ki-taban': 'gate-key',
  'ki-reptite-lair': 'dreamstone',
  'ki-fionas-shrine': 'ruby-knife',
  'ki-sunken-desert': 'c-trigger',
  'ki-arris-dome': 'clone',
  'ki-mt-woe': 'bent-sword',
  'ki-carpenters-wife': 'treasure-000',
  'ki-denadoro-mts': 'tomas-pop',
  'ki-zenan-bridge': 'hero-medal',
  'ki-giants-claw': 'prism-shard',
  'ki-sun-palace': 'moon-stone',
  'ki-snail-stop': 'jerky',
  'ki-frogs-burrow': 'grand-leon',
  'ki-geno-dome': 'robo-ribbon',
  'ki-melchior-sun-stone': 'treasure-000',
  'ki-cyrus-grave': 'treasure-000',
  'ki-ozzies-fort': 'treasure-000',
};

export { SPOT_VANILLA_ITEMS };
