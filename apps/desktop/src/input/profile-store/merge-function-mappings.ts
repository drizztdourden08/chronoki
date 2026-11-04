/* @layer renderer-lib @kind logic */
import { DEFAULT_FUNCTION_MAPPINGS } from '@chronoki/input-mapping';
import type { FunctionMapping } from '@chronoki/input-mapping';

const mergeFunctionMappings = (saved: readonly FunctionMapping[]): FunctionMapping[] => {
  const known = saved.filter((m) => DEFAULT_FUNCTION_MAPPINGS.some((def) => def.action === m.action));
  const present = new Set(known.map((m) => m.action));
  return [...known, ...DEFAULT_FUNCTION_MAPPINGS.filter((def) => !present.has(def.action))];
};

export { mergeFunctionMappings };
