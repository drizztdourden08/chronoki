/* @layer renderer-app @kind logic */
import { GATES_FLIPPED_ON_AFTER_RELEASE } from './normalise-settings.constants';
import type { FlippedDefaultsResult } from './migrate-flipped-defaults.type';

const migrateFlippedDefaults = (gates: readonly string[], applied: readonly string[] | undefined): FlippedDefaultsResult => {
  const done = applied ?? [];
  const pending = GATES_FLIPPED_ON_AFTER_RELEASE.filter((id) => !done.includes(id));
  const turnedOn = pending.filter((id) => !gates.includes(id));
  return { gates: [...gates, ...turnedOn], flippedDefaults: [...done, ...pending] };
};

export { migrateFlippedDefaults };
