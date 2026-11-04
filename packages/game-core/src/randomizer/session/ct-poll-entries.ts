/* @layer bridge-wasm @kind logic */
import type { PollEntry } from '@drizztdourden08/brock-randomizer/session';
import type { Placement } from '../apply/apply-seed.type';
import type { CheckDef } from '../checks/check.type';
import { toFlagProbe } from '../checks/to-flag-probe';

const ctPollEntries = (checks: readonly CheckDef[], pack: Placement): PollEntry[] =>
  checks.flatMap((check): PollEntry[] => {
    if (pack[check.id] === undefined) return [];
    if (check.probe) return [{ key: check.id, probe: toFlagProbe(check.probe) }];
    return check.kind === 'gift' ? [{ key: check.id, checkId: check.id }] : [];
  });

export { ctPollEntries };
