/* @layer renderer-components @kind constants */
import type { IconName } from '@drizztdourden08/tessera/primitives';

const DOMAIN_ICONS: Record<string, IconName> = {
  profiles: 'user',
  roms: 'gamepad-2',
  assets: 'package',
  input: 'keyboard',
  config: 'settings',
  logs: 'file-text',
};

export { DOMAIN_ICONS };
