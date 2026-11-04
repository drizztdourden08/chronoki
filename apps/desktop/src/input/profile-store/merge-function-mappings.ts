/* @layer renderer-lib @kind logic */
import { DEFAULT_FUNCTION_MAPPINGS } from '@chronoki/input-mapping';
import type { FunctionMapping } from '@chronoki/input-mapping';
import { LEGACY_ACTION_IDS } from './profile-store.constants';

const migrateLegacyAction = (mapping: FunctionMapping): FunctionMapping => {
  const renamed = LEGACY_ACTION_IDS[mapping.action];
  return renamed ? { ...mapping, action: renamed } : mapping;
};

const mergeFunctionMappings = (saved: readonly FunctionMapping[]): FunctionMapping[] => {
  const known = saved
    .map(migrateLegacyAction)
    .filter((m) => DEFAULT_FUNCTION_MAPPINGS.some((def) => def.action === m.action));
  const present = new Set(known.map((m) => m.action));
  return [...known, ...DEFAULT_FUNCTION_MAPPINGS.filter((def) => !present.has(def.action))];
};

export { mergeFunctionMappings };
