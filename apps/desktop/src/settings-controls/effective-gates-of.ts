/* @layer renderer-app @kind logic */
import { resolveGates } from '@chronoki/features';
import { isPackaged } from '@app/launch-flags/is-packaged';
import type { AppSettings } from '@app/settings.type';
import { steamSatisfied } from './steam-satisfied';

const effectiveGatesOf = (settings: AppSettings): ReadonlySet<string> => {
  const satisfied = steamSatisfied();
  const gates = (settings as Partial<AppSettings>).gates ?? [];
  return resolveGates(gates, { vanillaSafe: settings.vanillaSafe, packaged: isPackaged(), satisfied }).effective;
};

export { effectiveGatesOf };
