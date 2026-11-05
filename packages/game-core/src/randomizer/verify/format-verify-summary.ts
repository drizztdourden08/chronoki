/* @layer bridge-wasm @kind logic */
import type { VerifyFailure, VerifySummary } from './verify-result.type';

const failureLine = (failure: VerifyFailure): string => {
  const where = failure.error
    ? `error: ${failure.error}`
    : `stuck at sphere ${failure.sphere}, ${failure.unreachable} unreachable`;
  return `  FAIL seed=${failure.seed} options=${failure.optionSet} party=${failure.party} ${where}`;
};

const formatVerifySummary = (summary: VerifySummary): string =>
  [`${summary.passes}/${summary.runs} passed, ${summary.failures.length} failed`, ...summary.failures.map(failureLine)].join('\n');

export { formatVerifySummary };
