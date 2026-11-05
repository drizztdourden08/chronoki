/* @layer bridge-wasm @kind test */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { goldenPlacementOf } from './golden-placement-of';
import { GOLDEN_CASES } from './golden-seeds.cases';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'golden-fixtures');
const WRITE = process.env.GOLDEN_SEEDS_WRITE === '1';

describe('golden seeds', { tags: ['standard'] }, () => {
  for (const goldenCase of GOLDEN_CASES) {
    it(`${goldenCase.name} places identically`, () => {
      const text = JSON.stringify(goldenPlacementOf(goldenCase), null, 2);
      const file = join(FIXTURES, `${goldenCase.name}.json`);
      if (WRITE) {
        mkdirSync(FIXTURES, { recursive: true });
        writeFileSync(file, text);
        return;
      }
      expect(existsSync(file), `missing golden fixture ${goldenCase.name}.json, run with GOLDEN_SEEDS_WRITE=1`).toBe(true);
      expect(text === readFileSync(file, 'utf8'), `golden seed ${goldenCase.name} changed; rerun with GOLDEN_SEEDS_WRITE=1 only if intended`).toBe(true);
    });
  }
});
