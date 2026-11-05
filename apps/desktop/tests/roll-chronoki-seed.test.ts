/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import { rollChronokiSeed } from '@app/game/randomizer/roll-chronoki-seed';

const state = vi.hoisted(() => ({
  profiles: [] as { id: string; romFile: string }[],
  checks: [] as unknown[],
  loaded: [] as string[],
}));

vi.mock('@drizztdourden08/brock-react', () => ({
  useProfilesStore: { getState: () => ({ profiles: state.profiles }) },
  getPlatform: () => ({ files: {} }),
}));
vi.mock('@app/game/randomizer/pack-of-rom', () => ({
  packOfRom: (romFile: string) => {
    state.loaded.push(romFile);
    return Promise.resolve(new Uint8Array(0));
  },
}));
vi.mock('@chronoki/game-core', () => ({
  realWorldInputOfPack: () => ({ checks: state.checks }),
  resolveMysteryOptions: (options: unknown) => options,
  rollCtPlacement: (input: { checks: unknown[] }, seed: string) => ({ seed, count: input.checks.length }),
}));

const config: RandomizerProfileConfig = { mode: 'local', seed: 's1', options: {} };

describe('rollChronokiSeed', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.profiles = [{ id: 'p1', romFile: 'stored.sfc' }];
    state.checks = [{}, {}];
    state.loaded = [];
  });

  it('reads the checks of the ROM named by the profile being created', async () => {
    const placement = await rollChronokiSeed(config, { create: { name: 'n', romFile: 'new.sfc' } });
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
