/* @layer renderer-lib @kind constants */
import type { FunctionAction } from '@chronoki/input-mapping';

const LEGACY_ACTION_IDS: Readonly<Record<string, FunctionAction>> = {
  'fast-forward': 'turbo',
};

export { LEGACY_ACTION_IDS };
