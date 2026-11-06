/* @layer bridge-wasm @kind test */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../../checks/check.type';
import { createCtWorldDef } from '../create-ct-world-def';
import { createCtWorldGame } from '../create-ct-world-game';
import { CT_KIT } from '../ct-kit.constants';
import type { CtWorldInput } from '../ct-world-input.type';
import { modeOf } from '../modes/mode-of';
import { SHAPE_MODES } from './shape.constants';

const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];

const chest = (n: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
});

const inputOf = (gameMode: string, shape?: 'one'): CtWorldInput => ({
  checks: Array.from({ length: 42 }, (_, n) => chest(n)),
  options: { gameMode, partySize: 2 },
  ...(shape === undefined ? {} : { shape }),
});

const shapeOf = (gameMode: string) => {
  const { regions } = createCtWorldDef(inputOf(gameMode, 'one'));
  return {
    regions: regions.map((region) => region.id),
    exits: regions.flatMap((region) => region.exits.map((exit) => exit.name)),
    events: regions.flatMap((region) => region.events.map((event) => event.key)),
  };
};

const reachableOf = (gameMode: string, shape?: 'one'): string[] => {
  const { world } = createCtWorldGame(inputOf(gameMode, shape)).build({
    request: { seed: 's' }, prep: undefined, rng: createRng('s'), attempt: 0,
  });
  const state = CT_KIT.createCollectionState(world);
  modeOf({ gameMode }).keyItems.forEach((item) => state.collect(item));
  CT_KIT.collectReachableEvents(state);
  return [...CT_KIT.computeReachableRegions(state, world)].filter((id) => id !== 'menu').sort();
};

describe('one-shape world', { tags: ['critical'] }, () => {
  it('has the same region ids, exit names and event keys in every mode', () => {
    const [first, ...rest] = SHAPE_MODES.map((mode) => shapeOf(mode.id));
    rest.forEach((shape) => expect(shape).toEqual(first));
    expect(first?.regions).toContain('menu');
    expect(first?.events).toContain('ck-goal');
  });

  it('opens each mode as the legacy per-mode world does', () => {
    SHAPE_MODES.forEach((mode) => expect(reachableOf(mode.id, 'one'), mode.id).toEqual(reachableOf(mode.id)));
  });

  it('opens the lost-worlds bridges only in lost-worlds', () => {
    expect(reachableOf('lost-worlds', 'one')).not.toContain('present');
    expect(reachableOf('standard', 'one')).toContain('present');
    expect(reachableOf('ice-age', 'one')).not.toContain('magus-castle');
    expect(reachableOf('legacy-of-cyrus', 'one')).not.toContain('future');
  });
});
