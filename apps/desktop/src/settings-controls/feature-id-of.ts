/* @layer renderer-app @kind logic */
import { GATE_KEY_PREFIX, OPTION_KEY_FEATURE } from './gate-keys.constants';

const featureIdOf = (key: string): string | null => {
  if (key.startsWith(GATE_KEY_PREFIX)) return key.slice(GATE_KEY_PREFIX.length);
  return OPTION_KEY_FEATURE[key] ?? null;
};

export { featureIdOf };
