/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../checks/check.type';
import { spotChecksOf } from '../checks/spot-checks-of';
import { spotGiftChecksOf } from '../checks/spot-gift-checks-of';
import type { CtOptionValues } from './ct-world-input.type';
import { CT_MODES } from './modes/ct-modes.constants';
import { rollCtPlacement } from './roll-ct-placement';
import { SPOT_VANILLA_ITEMS } from './spot-vanilla-items.constants';

const IMPLEMENTED = CT_MODES.filter((mode) => mode.implemented).map((mode) => mode.id);
const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];
const SEEDS = ['unbound-a', 'unbound-b', 'unbound-c'];
const SPOT_OPTIONS: readonly (readonly [string, CtOptionValues])[] = [
  ['spot options off', {}],
  ['spot options on', { addCyrusGraveSpot: true, addOzzieSpot: true }],
];

const chests = Array.from({ length: 42 }, (_, n): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
}));

describe('rolls never put a pool item on an unbound spot', { tags: ['critical'] }, () => {
  it.each(IMPLEMENTED.flatMap((mode) => SPOT_OPTIONS.map(([label, options]) => [mode, label, options] as const)))(
    'mode %s, %s', (gameMode, _label, spotOptions) => {
      const options = { ...spotOptions, gameMode };
      const spots = spotGiftChecksOf(options);
      const checks = [...chests, ...spots];
      const bound = new Set(spots.map((check) => check.id));
      for (const seed of SEEDS) {
        const placement = rollCtPlacement({ checks, spotChecks: spotChecksOf(checks), options }, seed);
        const strays = placement.locations.filter(([location, item]) =>
          location in SPOT_VANILLA_ITEMS && !bound.has(location)
          && SPOT_VANILLA_ITEMS[location as keyof typeof SPOT_VANILLA_ITEMS] !== item);
        expect(strays).toEqual([]);
      }
    },
  );
});
