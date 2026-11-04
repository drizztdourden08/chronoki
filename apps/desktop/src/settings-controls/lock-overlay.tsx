/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { LockOverlayProps } from '@drizztdourden08/brock-react';
import { LockOverlay } from '@chronoki/design';
import { openSetting } from '@app/settings-nav/open-setting';
import { VANILLA_SAFE_KEY } from '@app/settings-nav/settings-nav.constants';

const openVanillaSafe = (): void => openSetting(VANILLA_SAFE_KEY);

const lockOverlay = ({ cause, children }: LockOverlayProps): ReactNode => (
  <LockOverlay cause={cause} onOpenSettings={cause === 'vanillaSafe' ? openVanillaSafe : undefined}>{children}</LockOverlay>
);

export { lockOverlay };
