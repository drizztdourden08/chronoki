/* @layer bridge-wasm @kind test */
import { trackerFromDef } from '@drizztdourden08/brock-randomizer/tracker';
import { describe, expect, it } from 'vitest';
import { createCtWorldDef } from './create-ct-world-def';
import { CT_MODES } from './modes/ct-modes.constants';

const IMPLEMENTED = CT_MODES.filter((mode) => mode.implemented).map((mode) => mode.id);

describe('vanilla items with no checks loaded', { tags: ['critical'] }, () => {
  it.each(IMPLEMENTED)('every location carries a vanilla item in mode %s', (gameMode) => {
    const def = createCtWorldDef({ checks: [], options: { gameMode } });
    const locations = def.regions.flatMap((region) => region.locations);
    expect(locations.length).toBeGreaterThan(0);
    expect(locations.filter((location) => location.vanillaItem === undefined).map((location) => location.key)).toEqual([]);
  });

  it.each(IMPLEMENTED)('builds the vanilla placement in mode %s', (gameMode) => {
    const tracker = trackerFromDef(createCtWorldDef({ checks: [], options: { gameMode } }), {});
    expect(() => tracker.vanilla?.()).not.toThrow();
  });
});
