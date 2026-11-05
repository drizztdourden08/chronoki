/* @layer bridge-wasm @kind constants */
import type { CtSpotId } from '../world/ct-world-keys.type';
import type { KeyItemSpotGift } from './key-item-spot-gift.type';

const KEY_ITEM_SPOT_GIFTS: readonly KeyItemSpotGift[] = [
  { spot: 'ki-snail-stop', check: 'gift-035-o9', item: 0xdb },
  { spot: 'ki-carpenters-wife', check: 'gift-03d-o8', item: 0xda },
  { spot: 'ki-denadoro-mts', check: 'gift-097-o10', item: 0x50 },
  { spot: 'ki-kings-trial', check: 'gift-1b6-o25', item: 0xe1 },
  { spot: 'ki-reptite-lair', check: 'gift-121-o0', item: 0xd7 },
  { spot: 'ki-arris-dome', check: 'gift-0d6-o15', item: 0xd5 },
  { spot: 'ki-sun-palace', check: 'gift-0fb-o17', item: 0xde },
  { spot: 'ki-mt-woe', check: 'gift-17e-o10', item: 0xe0 },
  { spot: 'ki-fionas-shrine', check: 'gift-053-o1', item: 0xaa },
];

const UNBOUND_KEY_ITEM_SPOTS: Readonly<Partial<Record<CtSpotId, string>>> = {
  'ki-zenan-bridge': 'two candidate gifts (castle chef gift-078-o15-0, knight captain gift-086-o13/gift-087-o13)',
  'ki-taban': 'three Taban gifts in one function (gift-004-o8-0/1/2); which one follows Heckran is not settled',
  'ki-melchior-sun-stone': 'two Sun Stone gifts in one function (gift-1b8-o23-0, gift-1b8-o23-1)',
  'ki-frogs-burrow': 'a chest in the burrow, not a gift; no chest binding yet',
  'ki-giants-claw': 'the Rainbow Shell is not an add-item gift; no operand found',
  'ki-geno-dome': "Robo's Ribbon is not an add-item gift; no operand found",
  'ki-sunken-desert': 'no add-item gift after Retinite found',
};

export { KEY_ITEM_SPOT_GIFTS, UNBOUND_KEY_ITEM_SPOTS };
