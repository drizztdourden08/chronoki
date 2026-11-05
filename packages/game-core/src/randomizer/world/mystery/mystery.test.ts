/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CT_OPTION_CATALOG } from '../ct-options.constants';
import { effectiveOptionsOf } from '../modes/effective-options-of';
import { mysteryRowsOf } from './mystery-rows-of';
import { resolveMysteryOptions } from './resolve-mystery-options';
import { rollMysteryOptions } from './roll-mystery-options';

const seedWhere = (prefix: string, test: (seed: string) => boolean): string =>
  Array.from({ length: 1000 }, (_, i) => `${prefix}${i}`).find(test) ?? '';

describe('mystery seed', { tags: ['critical'] }, () => {
  it('leaves options untouched when off', () => {
    const options = { itemDifficulty: 'hard', mysterySeed: false } as const;
    expect(resolveMysteryOptions(options, 'abc')).toBe(options);
    expect(resolveMysteryOptions({}, 'abc')).toEqual({});
  });

  it('rolls the same bag for the same seed and resolves idempotently', () => {
    const first = resolveMysteryOptions({ mysterySeed: true }, 'seed-1');
    expect(resolveMysteryOptions({ mysterySeed: true }, 'seed-1')).toEqual(first);
    expect(resolveMysteryOptions(first, 'seed-1')).toEqual(first);
    const others = ['seed-2', 'seed-3', 'seed-4', 'seed-5'].map((s) => JSON.stringify(rollMysteryOptions(s)));
    expect(others.some((other) => other !== JSON.stringify(rollMysteryOptions('seed-1')))).toBe(true);
  });

  it('rolls only implemented options that carry a weight', () => {
    const allowed = CT_OPTION_CATALOG.filter((option) => option.implemented && option.mystery !== undefined).map((option) => option.key);
    const rolled = Object.keys(rollMysteryOptions('seed-1'));
    expect([...rolled].sort()).toEqual([...allowed].sort());
    expect(rolled).not.toContain('startingParty');
    expect(rolled).not.toContain('mysterySeed');
  });

  it('keeps rolled choices inside the catalog choices', () => {
    const modes = CT_OPTION_CATALOG.find((option) => option.key === 'gameMode')?.choices ?? [];
    for (let i = 0; i < 30; i += 1) expect(modes).toContain(rollMysteryOptions(`s${i}`).gameMode);
  });

  it('lets mode forced options win after the roll', () => {
    const lost = seedWhere('s', (s) => rollMysteryOptions(s).gameMode === 'lost-worlds');
    const resolved = resolveMysteryOptions({ mysterySeed: true, epochFail: true }, lost);
    expect(resolved.epochFail).toBe(false);
    expect(effectiveOptionsOf(resolved).epochFail).toBe(false);
    const cyrus = seedWhere('c', (s) => rollMysteryOptions(s).gameMode === 'legacy-of-cyrus');
    expect(resolveMysteryOptions({ mysterySeed: true }, cyrus).earlyPendantCharge).toBe(true);
  });

  it('lists the rolled values for the spoiler', () => {
    expect(mysteryRowsOf(undefined)).toEqual([]);
    const rows = mysteryRowsOf({ gameMode: 'lost-worlds', bossRando: true });
    expect(rows).toContainEqual({ label: 'Mystery settings: Game mode', value: 'Lost Worlds' });
    expect(rows).toContainEqual({ label: 'Mystery settings: Boss randomization', value: 'On' });
  });
});
