/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { verifyCtPlacement } from '../../verify/verify-ct-placement';
import { verifyInputOf } from '../../verify/verify-synthetic-input';
import type { CtRegionSpec } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import { applyModeToRegions } from '../modes/apply-mode-to-regions';
import { CT_DEFAULT_MODE, CT_MODES } from '../modes/ct-modes.constants';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { applyStartPartyToRegions } from './apply-start-party-to-regions';
import type { CharacterAssignment } from './character-assignment.type';
import { characterRowsOf } from './character-rows-of';
import { CT_RECRUIT_SPOTS } from './ct-recruit-spots.constants';
import { LEGACY_PARTY } from './legacy-party.constants';

const standard = CT_MODES.find((mode) => mode.id === CT_DEFAULT_MODE);
const start: CtRegionId = standard?.start ?? 'present';
const BASE = standard ? applyModeToRegions(CT_REGIONS, standard) : [];

const eventsOf = (specs: readonly CtRegionSpec[], id: CtRegionId): { id: string; rule?: unknown }[] =>
  specs.find((spec) => spec.id === id)?.events ?? [];

const swapped: CharacterAssignment = { marle: 'marle', lucca: 'lucca', frog: 'frog', robo: 'ayla', ayla: 'robo' };

describe('recruit spots with an assignment', { tags: ['critical'] }, () => {
  it('keeps the old layout for no assignment and for the identity', () => {
    const identity: CharacterAssignment = { marle: 'marle', lucca: 'lucca', frog: 'frog', robo: 'robo', ayla: 'ayla' };
    const plain = applyStartPartyToRegions(BASE, start, LEGACY_PARTY);
    expect(applyStartPartyToRegions(BASE, start, LEGACY_PARTY, identity)).toEqual(plain);
    expect(applyStartPartyToRegions(BASE, start, LEGACY_PARTY, {})).toEqual(plain);
  });

  it('moves the character, and the spot rule stays with the spot', () => {
    const specs = applyStartPartyToRegions(BASE, start, LEGACY_PARTY, swapped);
    expect(eventsOf(specs, 'future').map((e) => e.id)).toEqual(['ayla']);
    expect(eventsOf(specs, 'future')[0]?.rule).toBe(CT_RECRUIT_SPOTS.robo?.rule);
    expect(eventsOf(specs, 'prehistory').map((e) => e.id)).toEqual(['robo']);
    expect(eventsOf(specs, 'prehistory')[0]?.rule).toBe(CT_RECRUIT_SPOTS.ayla?.rule);
  });

  it('does not grant a starting character at another spot', () => {
    const specs = applyStartPartyToRegions(BASE, start, ['crono', 'ayla'], swapped);
    expect(eventsOf(specs, 'future').map((e) => e.id)).toEqual([]);
    expect(eventsOf(specs, 'prehistory').map((e) => e.id)).toEqual(['robo']);
    const all = specs.flatMap((spec) => spec.events.map((e) => e.id));
    expect(all.filter((id) => id === 'ayla')).toHaveLength(1);
  });

  it('lists one spoiler row per spot', () => {
    expect(characterRowsOf(undefined)).toEqual([]);
    expect(characterRowsOf(swapped)).toContainEqual({ label: "Recruit at Robo's spot", value: 'Ayla' });
    expect(characterRowsOf(swapped)).toHaveLength(5);
  });
});

describe('character randomization', { tags: ['critical'] }, () => {
  it('stays beatable by the sphere sweep for every seed tried', () => {
    const results = Array.from({ length: 12 }, (_, n) =>
      verifyCtPlacement(verifyInputOf({ characterRando: true }, LEGACY_PARTY), `chars-${n}`));
    expect(results.filter((r) => !r.ok).map((r) => `${r.seed}: ${r.error ?? JSON.stringify(r.stuckAt)}`)).toEqual([]);
  });

  it('stays beatable with locked characters and Robo starting', () => {
    const results = Array.from({ length: 8 }, (_, n) =>
      verifyCtPlacement(verifyInputOf({ characterRando: true, lockedCharacters: true }, ['crono', 'robo']), `locked-${n}`));
    expect(results.filter((r) => !r.ok).map((r) => r.seed)).toEqual([]);
  });
});
