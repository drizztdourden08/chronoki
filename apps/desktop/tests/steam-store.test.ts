/* @layer tests @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { FileStore } from '@drizztdourden08/brock-core';
import { steamSatisfied } from '@app/settings-controls/steam-satisfied';
import { normaliseSettings } from '@app/settings-effects/normalise-settings';
import { DEFAULT_SETTINGS } from '@app/settings.constants';
import { hasSteamData } from '@app/storage/steam-store/has-steam-data';
import { onSteamDataChanged } from '@app/storage/steam-store/on-steam-data-changed';
import { parseSteamMarker } from '@app/storage/steam-store/parse-steam-marker';
import { readSteamMarker } from '@app/storage/steam-store/read-steam-marker';
import { readSteamWide } from '@app/storage/steam-store/read-steam-wide';
import { readWideHeader } from '@app/storage/steam-store/read-wide-header';
import { removeSteamData } from '@app/storage/steam-store/remove-steam-data';
import { STEAM_MARKER_FILE, STEAM_WIDE_FILE } from '@app/storage/steam-store/steam-store.constants';
import { writeSteamWide } from '@app/storage/steam-store/write-steam-wide';

const memoryFiles = (): FileStore => {
  const data = new Map<string, Uint8Array>();
  const encoder = new TextEncoder();
  return {
    readBytes: async (path) => data.get(path) ?? null,
    readText: async (path) => {
      const bytes = data.get(path);
      return bytes ? new TextDecoder().decode(bytes) : null;
    },
    writeBytes: async (path, bytes) => {
      data.set(path, bytes);
    },
    writeText: async (path, text) => {
      data.set(path, encoder.encode(text));
    },
    list: async () => [...data.keys()],
    remove: async (path) => {
      data.delete(path);
    },
    exists: async (path) => data.has(path),
    mkdir: async () => undefined,
    stat: async () => null,
  };
};

const syntheticWide = (margins: number): Uint8Array => {
  const bytes = new Uint8Array(24);
  bytes.set(new TextEncoder().encode('CTWD'), 0);
  const view = new DataView(bytes.buffer);
  view.setUint32(4, 3, true);
  view.setUint32(8, margins, true);
  return bytes;
};

describe('the derived Steam flag', { tags: ['critical'] }, () => {
  it('satisfies steamData only when imported, and drops the old stored key', () => {
    expect(steamSatisfied(true).has('steamData')).toBe(true);
    expect(steamSatisfied(false).has('steamData')).toBe(false);
    const stored = { ...DEFAULT_SETTINGS, steamDataImported: true };
    expect('steamDataImported' in normaliseSettings(stored, stored)).toBe(false);
  });
});

describe('the Steam data marker', { tags: ['critical'] }, () => {
  it('accepts a version 3 marker and refuses anything else', () => {
    const good = JSON.stringify({ version: 3, sourceName: 'resources.bin', sourceBytes: 10, builtAt: '2026-01-01T00:00:00.000Z' });
    expect(parseSteamMarker(good)?.sourceName).toBe('resources.bin');
    expect(parseSteamMarker(good.replace('"version":3', '"version":2'))).toBeNull();
    expect(parseSteamMarker('not json')).toBeNull();
    expect(parseSteamMarker(null)).toBeNull();
  });

  it('reads the margin count from a wide header', () => {
    expect(readWideHeader(syntheticWide(5))).toEqual({ version: 3, margins: 5 });
    expect(readWideHeader(new Uint8Array(4))).toBeNull();
    expect(readWideHeader(new Uint8Array(24))).toBeNull();
  });

  it('counts only a marker with its file, and tells listeners about changes', async () => {
    const files = memoryFiles();
    const listener = vi.fn();
    const off = onSteamDataChanged(listener);
    expect(await hasSteamData(files)).toBe(false);
    await writeSteamWide(syntheticWide(2), { name: 'resources.bin', bytes: 99 }, files);
    expect(await hasSteamData(files)).toBe(true);
    expect((await readSteamMarker(files))?.sourceBytes).toBe(99);
    expect((await readSteamWide(files))?.length).toBe(24);
    await files.remove(STEAM_WIDE_FILE);
    expect(await hasSteamData(files)).toBe(false);
    await writeSteamWide(syntheticWide(2), { name: 'resources.bin', bytes: 99 }, files);
    await removeSteamData(files);
    expect(await hasSteamData(files)).toBe(false);
    expect(await files.exists(STEAM_MARKER_FILE)).toBe(false);
    expect(listener).toHaveBeenCalledTimes(3);
    off();
  });
});
