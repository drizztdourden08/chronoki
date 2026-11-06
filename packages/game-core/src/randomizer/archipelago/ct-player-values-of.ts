/* @layer bridge-wasm @kind logic */
import type { ExportedOption } from '@drizztdourden08/brock-randomizer/archipelago';

const ctPlayerValuesOf = (
  values: Readonly<Record<string, unknown>>,
  rows: readonly ExportedOption[],
): Record<string, unknown> => {
  const known = new Set(rows.map((row) => row.key));
  return Object.fromEntries(Object.entries(values).filter(([key]) => known.has(key)));
};

export { ctPlayerValuesOf };
