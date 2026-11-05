/* @layer bridge-wasm @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatVerifySummary } from './format-verify-summary';
import { VERIFY_OPTION_SETS } from './verify-option-sets.constants';
import { verifySeeds } from './verify-seeds';

const packPath = process.env.CHRONOKI_PACK ?? '';
const enabled = packPath !== '' && existsSync(packPath);

describe.skipIf(!enabled)('seed verifier on the real game pack', { tags: ['e2e'] }, () => {
  it('proves 20 seeds per option set end to end with the legacy party', () => {
    const pack = new Uint8Array(readFileSync(packPath));
    const summary = verifySeeds({ pack, count: 20, baseSeed: 'real-legacy', party: 'legacy' });
    expect(summary.runs).toBe(20 * VERIFY_OPTION_SETS.length);
    expect(summary.failures.length, formatVerifySummary(summary)).toBe(0);
  }, 600_000);

  it('proves 3 seeds end to end for every start party subset', () => {
    const pack = new Uint8Array(readFileSync(packPath));
    const summary = verifySeeds({ pack, count: 3, baseSeed: 'real-subsets', party: 'all-subsets', optionSets: VERIFY_OPTION_SETS.slice(0, 1) });
    expect(summary.runs).toBe(3 * 127);
    expect(summary.failures.length, formatVerifySummary(summary)).toBe(0);
  }, 600_000);
});
