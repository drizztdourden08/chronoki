/* @layer bridge-wasm @kind test */
import { createRng, generate, sweepPlacementSpheres, worldGameFromDef } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import { deriveSealedCheckIds } from '../checks/derive-sealed-check-ids';
import type { CheckDef } from '../checks/check.type';
import { createCtWorldDef } from './create-ct-world-def';
import { createCtWorldGame } from './create-ct-world-game';
import { ctOptionValues } from './ct-option-values';
import { CT_KIT } from './ct-kit.constants';
import type { CtOptionValues, CtWorldInput } from './ct-world-input.type';
import type { CtEventId, CtItem } from './ct-world-keys.type';
import { CT_REGIONS } from './regions/ct-regions.constants';

const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];
const SEALED = 'chest-test-0';
const OPEN = 'chest-test-1';
const SEEDS = 100;

const chest = (n: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
});

const inputOf = (options: CtOptionValues = {}, sealedCount = 1): CtWorldInput => ({
  checks: Array.from({ length: 42 }, (_, n) => chest(n)),
  sealedCheckIds: new Set(Array.from({ length: sealedCount }, (_, n) => `chest-test-${n}`)),
  options,
});

const gameOf = (input: CtWorldInput) =>
  worldGameFromDef({ ...createCtWorldDef(input), options: () => ({ ...ctOptionValues(), ...input.options }) });

const worldOf = (input: CtWorldInput, seed = 'ct-missing') =>
  gameOf(input).build({ request: { seed }, prep: undefined, rng: createRng(seed), attempt: 0 }).world;

const stateOf = (input: CtWorldInput, held: readonly (CtItem | CtEventId)[]) => {
  const state = CT_KIT.createCollectionState(worldOf(input));
  held.forEach((item) => state.collect(item));
  return state;
};

const canGet = (input: CtWorldInput, held: readonly (CtItem | CtEventId)[], key: string): boolean =>
  CT_KIT.canCollectLocation(stateOf(input, held), key);

const canReach = (input: CtWorldInput, held: readonly (CtItem | CtEventId)[], region: 'northern-ruins' | 'ozzies-fort') =>
  stateOf(input, held).canReachRegion(region);

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];
const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];

const sealedPack = (): Uint8Array => {
  const header = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0, 0, 0];
  const pad = new Array<number>(30).fill(0);
  const objects = [...le16(64), ...pad, ...le16(72), ...pad];
  const sealedBody = [0x16, 0xf4, 0x40, 0x06, 0x00, 0xca, 0x0a, 0x00];
  const plainBody = [0xca, 0x0b, 0x00];
  const script = [2, ...objects, ...sealedBody, ...plainBody];
  const blobs = [{ type: 3, id: 0x12, data: header }, { type: 16, id: 7, data: script }];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((blob) => {
    bytes.push(...le32(blob.type), ...le32(blob.id), ...le32(at), ...le32(blob.data.length));
    at += blob.data.length;
  });
  blobs.forEach((blob) => bytes.push(...blob.data));
  return Uint8Array.from(bytes);
};

describe('sealed-open', () => {
  it('finds the gift checks whose script tests the charged-pendant bit', { tags: ['critical'] }, () => {
    expect([...deriveSealedCheckIds(sealedPack())]).toEqual(['gift-012-o0']);
    expect(deriveSealedCheckIds(new Uint8Array(64)).size).toBe(0);
  });

  it('keeps sealed checks shut without the pendant, even with the early option', { tags: ['critical'] }, () => {
    expect(canGet(inputOf(), [], SEALED)).toBe(false);
    expect(canGet(inputOf({ earlyPendantCharge: true }), [], SEALED)).toBe(false);
    expect(canGet(inputOf(), [], OPEN)).toBe(true);
  });

  it('opens them with the pendant only through the early option, Tyrano Lair or Magus Castle', { tags: ['critical'] }, () => {
    expect(canGet(inputOf(), ['pendant'], SEALED)).toBe(false);
    expect(canGet(inputOf({ earlyPendantCharge: true }), ['pendant'], SEALED)).toBe(true);
    expect(canGet(inputOf(), ['pendant', 'gate-key', 'dreamstone'], SEALED)).toBe(true);
    expect(canGet(inputOf(), ['pendant', 'masamune', 'frog'], SEALED)).toBe(true);
  });
});

describe('Sunken Desert', () => {
  it('needs Robo', { tags: ['critical'] }, () => {
    expect(canGet(inputOf(), ['pendant'], 'ki-sunken-desert')).toBe(false);
    expect(canGet(inputOf(), ['robo'], 'ki-sunken-desert')).toBe(true);
  });
});

describe('Northern Ruins', () => {
  it('opens from the Middle Ages with the Masamune', { tags: ['critical'] }, () => {
    expect(canReach(inputOf(), ['frog'], 'northern-ruins')).toBe(false);
    expect(canReach(inputOf(), ['masamune'], 'northern-ruins')).toBe(true);
  });
});

describe("Cyrus's Grave", () => {
  it('needs Frog in the ruins and the add-spot option', { tags: ['critical'] }, () => {
    const on = inputOf({ addCyrusGraveSpot: true });
    expect(canGet(on, ['masamune'], 'ki-cyrus-grave')).toBe(false);
    expect(canGet(on, ['masamune', 'frog'], 'ki-cyrus-grave')).toBe(true);
    expect(canGet(inputOf(), ['masamune', 'frog'], 'ki-cyrus-grave')).toBe(false);
  });
});

describe("Ozzie's Fort", () => {
  it('is reached only through Magus Castle and holds a spot only when added', { tags: ['critical'] }, () => {
    const on = inputOf({ addOzzieSpot: true });
    expect(canReach(on, ['masamune'], 'ozzies-fort')).toBe(false);
    expect(canReach(on, ['masamune', 'frog'], 'ozzies-fort')).toBe(true);
    expect(canGet(on, ['masamune', 'frog'], 'ki-ozzies-fort')).toBe(true);
    expect(canGet(inputOf(), ['masamune', 'frog'], 'ki-ozzies-fort')).toBe(false);
  });
});

describe('recruits', () => {
  it('keeps Frog free in the Middle Ages and moves Lucca there', { tags: ['critical'] }, () => {
    const events = (id: string): readonly { id: string; rule?: unknown }[] =>
      CT_REGIONS.find((spec) => spec.id === id)?.events ?? [];
    expect(events('middle-ages').find((event) => event.id === 'frog')?.rule).toBeUndefined();
    expect(events('middle-ages').find((event) => event.id === 'lucca')?.rule).toBeUndefined();
    expect(events('present').some((event) => event.id === 'lucca')).toBe(false);
    expect(CT_KIT.canReachEvent(stateOf(inputOf(), []), 'lucca')).toBe(true);
  });
});

describe('Robo (Factory)', () => {
  it('stays in the future with locked characters, and needs the pendant to get there', { tags: ['critical'] }, () => {
    const locked = inputOf({ lockedCharacters: true });
    expect(CT_KIT.canReachEvent(stateOf(locked, []), 'robo')).toBe(false);
    expect(CT_KIT.canReachEvent(stateOf(locked, ['pendant']), 'robo')).toBe(true);
    expect(CT_KIT.canReachEvent(stateOf(inputOf(), ['pendant']), 'robo')).toBe(true);
  });
});

const isBeaten = (input: CtWorldInput, seed: string): boolean => {
  const placement = generate(createCtWorldGame(input), { seed });
  const world = worldOf(input, seed);
  world.placedItems.clear();
  placement.locations.forEach(([location, item]) => world.placedItems.set(location, item));
  return sweepPlacementSpheres(world).beaten;
};

describe('standard seeds', () => {
  it('are all beaten with sealed checks present', { tags: ['critical'] }, () => {
    const input = inputOf({}, 10);
    const failed = Array.from({ length: SEEDS }, (_, n) => `ct-missing-${n}`).filter((seed) => !isBeaten(input, seed));
    expect(failed).toEqual([]);
  });
});
