/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { formatVerifySummary } from './format-verify-summary';
import { VERIFY_OPTION_SETS } from './verify-option-sets.constants';
import { verifySeeds } from './verify-seeds';
import { REFUSED_PARTIES } from './verify.constants';

const failedParties = (parties: readonly string[]): string[] =>
  parties.filter((party) => !REFUSED_PARTIES.includes(party));

describe('seed verifier', { tags: ['e2e'] }, () => {
  it('has the default set and the existing options', () => {
    expect(VERIFY_OPTION_SETS[0]?.name).toBe('default');
    expect(VERIFY_OPTION_SETS.length).toBeGreaterThan(1);
  });

  it('proves 25 seeds beatable for every option set with the legacy party', () => {
    const summary = verifySeeds({ count: 25, baseSeed: 'verify-legacy', party: 'legacy' });
    expect(summary.runs).toBe(25 * VERIFY_OPTION_SETS.length);
    expect(summary.failures.length, formatVerifySummary(summary)).toBe(0);
  });

  it('proves 5 seeds beatable for every start party subset', () => {
    const summary = verifySeeds({ count: 5, baseSeed: 'verify-subsets', party: 'all-subsets', optionSets: VERIFY_OPTION_SETS.slice(0, 1) });
    const unexpected = failedParties(summary.failures.map((failure) => failure.party));
    expect(summary.runs).toBe(5 * 127);
    expect(unexpected, formatVerifySummary(summary)).toEqual([]);
  });
});
