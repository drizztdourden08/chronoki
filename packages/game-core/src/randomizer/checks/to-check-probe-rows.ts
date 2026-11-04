/* @layer bridge-wasm @kind logic */
import type { CheckDef } from './check.type';
import type { CheckProbeRow } from './check-probe-row.type';
import { toFlagProbe } from './to-flag-probe';

const toCheckProbeRows = (checks: readonly CheckDef[]): CheckProbeRow[] =>
  checks.flatMap((check) => (check.probe ? [{ key: check.id, probe: toFlagProbe(check.probe) }] : []));

export { toCheckProbeRows };
