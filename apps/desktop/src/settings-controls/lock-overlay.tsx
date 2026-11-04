/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { LockOverlayProps } from '@drizztdourden08/brock-react';
import { LockOverlay } from '@chronoki/design';
import { openSetting } from '@app/settings-nav/open-setting';
import { ORIGINAL_MODE_KEY } from '@app/settings-nav/settings-nav.constants';

const openOriginalMode = (): void => openSetting(ORIGINAL_MODE_KEY);

const lockOverlay = ({ cause, children }: LockOverlayProps): ReactNode => (
  <LockOverlay cause={cause} onOpenSettings={cause === 'vanillaSafe' ? openOriginalMode : undefined}>{children}</LockOverlay>
);

export { lockOverlay };
