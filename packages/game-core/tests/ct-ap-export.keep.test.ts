/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { AP_GAME, AP_WORLD_VERSION, CT_AP_ITEM_IDS, CT_AP_LOCATION_IDS, exportCtWorld, ctOptionRows } from '../src/randomizer/archipelago';
import { CT_AP_ITEM_NAMES } from '../src/randomizer/archipelago/ct-ap-item-names.constants';
import { CT_AP_LOCATION_NAMES } from '../src/randomizer/archipelago/ct-ap-location-names.constants';

const EXPORT_FILES = ['game.json', 'locations.json', 'regions.json', 'items.json', 'rules.json', 'options.json'];
const NOT_PLAIN_TEXT = /[\u0000-\u001f\u007f-\u009f�]/;

interface NamedRow { key: string; name: string }

const stringsIn = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (typeof value === 'object' && value !== null) return Object.entries(value).flatMap(([key, inner]) => [key, ...stringsIn(inner)]);
  return [];
};

describe('the Archipelago world export', { tags: ['critical'] }, () => {
  const world = exportCtWorld();

  it('is the six JSON files and no others', () => {
    expect(Object.keys(world).sort()).toEqual([...EXPORT_FILES].sort());
  });

  it('is the same every time it is made, and survives a JSON round trip', () => {
    const again = exportCtWorld();
    expect(JSON.stringify(again)).toBe(JSON.stringify(world));
    expect(JSON.parse(JSON.stringify(world))).toEqual(world);
  });

  it('names the game and the world version from the constants', () => {
    expect(JSON.stringify(world['game.json'])).toContain(AP_GAME);
    expect(JSON.stringify(world['game.json'])).toContain(AP_WORLD_VERSION);
  });

  it('lists the locations and items under the frozen ids and the names written in code', () => {
    const locations = world['locations.json'] as readonly NamedRow[];
    const items = world['items.json'] as readonly NamedRow[];
    const locationNames = new Set(Object.values(CT_AP_LOCATION_NAMES));
    const itemNames = new Set(Object.values(CT_AP_ITEM_NAMES));
    expect(locations.length).toBeGreaterThan(0);
    expect(items.length).toBeGreaterThan(0);
    expect(locations.filter((row) => !(row.key in CT_AP_LOCATION_IDS) || !locationNames.has(row.name))).toEqual([]);
    expect(items.filter((row) => !(row.key in CT_AP_ITEM_IDS) || !itemNames.has(row.name))).toEqual([]);
  });

  it('carries the option rows the player file reads', () => {
    const exported = (world['options.json'] as readonly { key: string }[]).map((row) => row.key);
    expect(exported).toEqual(ctOptionRows().map((row) => row.key));
  });

  it('holds no text that came from the pack or the ROM', () => {
    const text = stringsIn(world);
    expect(text.length).toBeGreaterThan(0);
    expect(text.filter((line) => NOT_PLAIN_TEXT.test(line))).toEqual([]);
    expect(exportCtWorld.length).toBe(0);
  });
});
