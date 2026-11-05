/* @layer bridge-wasm @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STANDARD_START } from '../../apply/start-state/standard-start.constants';
import type { CtPlacement } from '../../world/ct-placement.type';
import { comparePackToPlacement } from './compare-pack-to-placement';

const PACK_ENV = 'CHRONOKI_SEED_PACK';
const PLACEMENT_ENV = 'CHRONOKI_SEED_PLACEMENT';

const packPath = process.env[PACK_ENV] ?? '';
const placementPath = process.env[PLACEMENT_ENV] ?? '';
const enabled = packPath !== '' && placementPath !== '' && existsSync(packPath) && existsSync(placementPath);

describe.skipIf(!enabled)('comparePackToPlacement on a real written pack', () => {
  it('finds no mismatch between the written pack and its placement', () => {
    const pack = new Uint8Array(readFileSync(packPath));
    const placement = JSON.parse(readFileSync(placementPath, 'utf8')) as CtPlacement;
    expect(comparePackToPlacement(pack, placement, { startState: STANDARD_START })).toEqual([]);
  });
});
