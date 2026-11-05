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
  { spot: 'ki-zenan-bridge', check: 'gift-078-o15-0', item: 0xdb },
  { spot: 'ki-taban', check: 'gift-004-o8-2', item: 0x79 },
  { spot: 'ki-melchior-sun-stone', check: 'gift-1b8-o23-1', item: 0x55 },
  { spot: 'ki-frogs-burrow', check: 'chest-08d-0', item: 0x99 },
];

const UNBOUND_KEY_ITEM_SPOTS: Readonly<Partial<Record<CtSpotId, string>>> = {
  'ki-giants-claw': 'the Rainbow Shell is a story flag, not an item; pinned to its vanilla Prism Shard',
  'ki-geno-dome': "Atropos raises Robo's stats directly, no item; pinned to its vanilla Robo Ribbon",
  'ki-sunken-desert': 'Retinite gives no item; pinned to its vanilla Chrono Trigger',
};

export { KEY_ITEM_SPOT_GIFTS, UNBOUND_KEY_ITEM_SPOTS };
