/* @layer bridge-wasm @kind logic */
import type { CheckDef, CheckKind } from '../checks/check.type';
import { PINNED_SOURCES } from '../world/pinned-sources.constants';
import { CT_AP_LOCATION_IDS } from './ct-ap-location-ids.constants';
import { CT_WIDEST_CHECK_KINDS } from './ct-widest-checks.constants';

const PINNED_KEYS: ReadonlySet<string> = new Set(PINNED_SOURCES.map((source) => source.key));

const checkOf = (id: string): CheckDef | undefined => {
  const [prefix, map] = id.split('-');
  const kind: CheckKind | undefined = CT_WIDEST_CHECK_KINDS.find(([name]) => name === prefix)?.[1];
  if (kind === undefined || map === undefined || PINNED_KEYS.has(id)) return undefined;
  return { id, kind, locationId: parseInt(map, 16), vanillaItem: 0 };
};

const ctWidestChecks = (): CheckDef[] =>
  Object.keys(CT_AP_LOCATION_IDS).flatMap((id) => checkOf(id) ?? []);

export { ctWidestChecks };
