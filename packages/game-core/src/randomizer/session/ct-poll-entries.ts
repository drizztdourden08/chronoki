/* @layer bridge-wasm @kind logic */
import type { PollEntry } from '@drizztdourden08/brock-randomizer/session';
import type { Placement } from '../apply/apply-seed.type';
import type { CheckDef } from '../checks/check.type';
import { spotChecksOf } from '../checks/spot-checks-of';
import { toFlagProbe } from '../checks/to-flag-probe';

const ctPollEntries = (checks: readonly CheckDef[], pack: Placement): PollEntry[] => {
  const spotOf = new Map([...(spotChecksOf(checks) ?? [])].map(([spot, id]): [string, string] => [id, spot]));
  return checks.flatMap((check): PollEntry[] => {
    if (pack[check.id] === undefined) return [];
    const key = spotOf.get(check.id) ?? check.id;
    if (check.probe) return [{ key, probe: toFlagProbe(check.probe) }];
    return check.kind === 'gift' ? [{ key, checkId: check.id }] : [];
  });
};

export { ctPollEntries };
