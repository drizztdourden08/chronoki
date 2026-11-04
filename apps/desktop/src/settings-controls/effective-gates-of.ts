/* @layer renderer-app @kind logic */
import { resolveGates } from '@chronoki/features';
import { isPackaged } from '@app/launch-flags/is-packaged';
import type { AppSettings } from '@app/settings.type';

const effectiveGatesOf = (settings: AppSettings): ReadonlySet<string> => {
  const satisfied = new Set(settings.steamDataImported ? ['steamData'] : []);
  return resolveGates(settings.gates ?? [], { vanillaSafe: settings.vanillaSafe, packaged: isPackaged(), satisfied }).effective;
};

export { effectiveGatesOf };
