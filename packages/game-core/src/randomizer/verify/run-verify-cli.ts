/* @layer bridge-wasm @kind logic */
import { formatVerifySummary } from './format-verify-summary';
import { parseVerifyArgs } from './parse-verify-args';
import { verifySeeds } from './verify-seeds';

const runVerifyCli = (argv: readonly string[]): number => {
  const { request, json } = parseVerifyArgs(argv);
  const summary = verifySeeds(request);
  process.stdout.write(`${json ? JSON.stringify(summary, null, 2) : formatVerifySummary(summary)}\n`);
  return summary.failures.length > 0 ? 1 : 0;
};

export { runVerifyCli };
