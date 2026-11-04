/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { memoryFiles } from './support/memory-files';
import { DEFAULT_CK_SETTINGS } from '@chronoki/game-core';
import { steamBootFiles } from '@app/game/lifecycle/steam-boot-files';
import { writeSteamWide } from '@app/storage/steam-store/write-steam-wide';

describe('steamBootFiles', { tags: ['critical'] }, () => {
  it('gives nothing when the margins gate is off, even with data stored', async () => {
    const files = memoryFiles();
    await writeSteamWide(new Uint8Array([1, 2, 3]), { name: 'resources.bin', bytes: 1 }, files);
    expect(await steamBootFiles({ ...DEFAULT_CK_SETTINGS, steamMargins: false }, files)).toEqual({});
    expect(await steamBootFiles(undefined, files)).toEqual({});
  });

  it('gives nothing when the gate is on but no data is stored', async () => {
    expect(await steamBootFiles({ ...DEFAULT_CK_SETTINGS, steamMargins: true }, memoryFiles())).toEqual({});
  });

  it('gives the derived file when the gate is on and data is stored', async () => {
    const files = memoryFiles();
    await writeSteamWide(new Uint8Array([1, 2, 3]), { name: 'resources.bin', bytes: 1 }, files);
    const out = await steamBootFiles({ ...DEFAULT_CK_SETTINGS, steamMargins: true }, files);
    expect(out['/ct_wide.dat']).toEqual(new Uint8Array([1, 2, 3]));
  });
});
