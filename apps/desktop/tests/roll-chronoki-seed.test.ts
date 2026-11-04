/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import { rollChronokiSeed } from '@app/game/randomizer/roll-chronoki-seed';

const state = vi.hoisted(() => ({
  profiles: [] as { id: string; romFile: string }[],
  checks: [] as unknown[],
  loaded: [] as string[],
}));

vi.mock('@drizztdourden08/brock-react', () => ({ useProfilesStore: { getState: () => ({ profiles: state.profiles }) } }));
vi.mock('@app/game/randomizer/checks-of-rom', () => ({
  checksOfRom: async (romFile: string) => {
    state.loaded.push(romFile);
    return state.checks;
  },
}));
vi.mock('@chronoki/game-core', () => ({ rollCtPlacement: (input: { checks: unknown[] }, seed: string) => ({ seed, count: input.checks.length }) }));

const config = { seed: 's1', options: {} } as unknown as RandomizerProfileConfig;

describe('rollChronokiSeed', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.profiles = [{ id: 'p1', romFile: 'stored.sfc' }];
    state.checks = [{}, {}];
    state.loaded = [];
  });

  it('reads the checks of the ROM named by the profile being created', async () => {
    const placement = await rollChronokiSeed(config, { create: { name: 'n', romFile: 'new.sfc' } as never });
    expect(state.loaded).toEqual(['new.sfc']);
    expect(placement).toEqual({ seed: 's1', count: 2 });
  });

  it('reads the checks of the stored profile on a re-roll', async () => {
    await rollChronokiSeed(config, { profileId: 'p1' });
    expect(state.loaded).toEqual(['stored.sfc']);
  });

  it('refuses when no ROM can be found for the roll', async () => {
    await expect(rollChronokiSeed(config, { profileId: 'missing' })).rejects.toThrow(/game pack/);
  });

  it('refuses a pack with no checks', async () => {
    state.checks = [];
    await expect(rollChronokiSeed(config, { profileId: 'p1' })).rejects.toThrow(/no checks/);
  });
});
