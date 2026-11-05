/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  AP_GAME, AP_ID_BASE, AP_ITEM_ID_OFFSET, CT_AP_ITEM_IDS, CT_AP_LOCATION_IDS, ctApItemUniverse, ctApLocationUniverse,
  WORLD_MODULE_NAME,
} from '../src/randomizer/archipelago';
import { CT_KEY_ITEMS } from '../src/randomizer/world/ct-key-items.constants';
import { CT_CHARACTERS } from '../src/randomizer/world/party/ct-party.constants';

const FROZEN_LOCATIONS = 406;
const FROZEN_ITEMS = 160;

const LOCATION_DIGEST = 'f8979c63e554ae3fd43744b672b69f975b1054918a28104aab6148d573020527';
const ITEM_DIGEST = 'd99532aeeeb500f8e01e53253595741aafbc0fd6939ad893eec406b203187c3f';

const APPEND_ONLY = 'Archipelago ids are append-only: an id already handed out was changed, reused or removed';
const EVENT_KEYS = ['masamune', 'kings-trial-done', 'beat-lavos', 'beat-ozzie', 'cyrus-done', 'beat-giga-gaia'];

const itemBase = AP_ID_BASE + AP_ITEM_ID_OFFSET;
const locationIds = Object.values(CT_AP_LOCATION_IDS);
const itemIds = Object.values(CT_AP_ITEM_IDS);

const digestOf = (ids: Readonly<Record<string, number>>, base: number, count: number): string => {
  const lines = Object.entries(ids)
    .filter(([, id]) => id < base + count)
    .sort(([, left], [, right]) => left - right)
    .map(([key, id]) => `${id}=${key}`);
  return createHash('sha256').update(lines.join('\n')).digest('hex');
};

describe('ChronoKi Archipelago identity', { tags: ['critical'] }, () => {
  it('keeps the public game name, module and id base', () => {
    expect(AP_GAME).toBe('ChronoKi');
    expect(WORLD_MODULE_NAME).toBe('chronoki');
    expect(AP_ID_BASE).toBe(0x434b0000);
    expect(AP_ITEM_ID_OFFSET).toBe(0x10000);
  });
});

describe('ChronoKi Archipelago ids cover the world', { tags: ['critical'] }, () => {
  it('gives every key item an id', () => {
    const keys = [...CT_KEY_ITEMS, 'jets-of-time'];
    expect(keys.filter((key) => CT_AP_ITEM_IDS[key] === undefined)).toEqual([]);
  });

  it('gives no character or story event an id', () => {
    const events = [...CT_CHARACTERS, ...EVENT_KEYS];
    expect(events.filter((key) => key in CT_AP_LOCATION_IDS || key in CT_AP_ITEM_IDS)).toEqual([]);
    expect(Object.keys(CT_AP_LOCATION_IDS).filter((key) => key.startsWith('objective-'))).toEqual([]);
  });

  it('lists every id in its universe', () => {
    expect(ctApLocationUniverse()).toHaveLength(locationIds.length);
    expect(ctApItemUniverse()).toHaveLength(itemIds.length);
  });
});

describe('ChronoKi Archipelago ids are unique', { tags: ['critical'] }, () => {
  it('uses every id once, locations and items in their own ranges', () => {
    expect(new Set([...locationIds, ...itemIds]).size).toBe(locationIds.length + itemIds.length);
    expect(locationIds.every((id) => id >= AP_ID_BASE && id < itemBase)).toBe(true);
    expect(itemIds.every((id) => id >= itemBase)).toBe(true);
  });
});

describe('ChronoKi Archipelago ids are frozen', { tags: ['critical'] }, () => {
  it('keeps every location id already handed out', () => {
    expect(locationIds.length, APPEND_ONLY).toBeGreaterThanOrEqual(FROZEN_LOCATIONS);
    expect(digestOf(CT_AP_LOCATION_IDS, AP_ID_BASE, FROZEN_LOCATIONS), APPEND_ONLY).toBe(LOCATION_DIGEST);
  });

  it('keeps every item id already handed out', () => {
    expect(itemIds.length, APPEND_ONLY).toBeGreaterThanOrEqual(FROZEN_ITEMS);
    expect(digestOf(CT_AP_ITEM_IDS, itemBase, FROZEN_ITEMS), APPEND_ONLY).toBe(ITEM_DIGEST);
  });
});
