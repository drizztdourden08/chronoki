/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { memoryFiles } from './support/memory-files';
import { prepareBootAssets } from '@app/game/randomizer/prepare-boot-assets';

const state = vi.hoisted((): { result: { ok: true; assets: Uint8Array } | { ok: false; reason: string }; reported: string[] } => ({
  result: { ok: true, assets: new Uint8Array([1]) },
  reported: [],
}));

vi.mock('@app/game/randomizer/prepare-seeded-assets', () => ({ prepareSeededAssets: () => Promise.resolve(state.result) }));
vi.mock('@app/game/randomizer/report-boot-refusal', () => ({ reportBootRefusal: (reason: string) => state.reported.push(reason) }));

describe('prepareBootAssets', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.reported = [];
  });

  it('hands the seeded pack to the session', async () => {
    state.result = { ok: true, assets: new Uint8Array([7]) };
    expect(await prepareBootAssets('p1', new Uint8Array([1]), memoryFiles())).toEqual(new Uint8Array([7]));
    expect(state.reported).toEqual([]);
  });

  it('reports a refusal and returns null so the session does not start', async () => {
    state.result = { ok: false, reason: 'no seed' };
    expect(await prepareBootAssets('p1', new Uint8Array([1]), memoryFiles())).toBeNull();
    expect(state.reported).toEqual(['no seed']);
  });
});
