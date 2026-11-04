/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prepareBootAssets } from '@app/game/randomizer/prepare-boot-assets';

const state = vi.hoisted(() => ({
  result: { ok: true, assets: new Uint8Array([1]) } as { ok: true; assets: Uint8Array } | { ok: false; reason: string },
  reported: [] as string[],
}));

vi.mock('@app/game/randomizer/prepare-seeded-assets', () => ({ prepareSeededAssets: async () => state.result }));
vi.mock('@app/game/randomizer/report-boot-refusal', () => ({ reportBootRefusal: (reason: string) => state.reported.push(reason) }));

describe('prepareBootAssets', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.reported = [];
  });

  it('hands the seeded pack to the session', async () => {
    state.result = { ok: true, assets: new Uint8Array([7]) };
    expect(await prepareBootAssets('p1', new Uint8Array([1]))).toEqual(new Uint8Array([7]));
    expect(state.reported).toEqual([]);
  });

  it('reports a refusal and returns null so the session does not start', async () => {
    state.result = { ok: false, reason: 'no seed' };
    expect(await prepareBootAssets('p1', new Uint8Array([1]))).toBeNull();
    expect(state.reported).toEqual(['no seed']);
  });
});
