/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import type { LockOverlayProps } from '@drizztdourden08/brock-react';
import { LockOverlay } from '@chronoki/design';

const lockOverlay = ({ cause, children }: LockOverlayProps): ReactNode => <LockOverlay cause={cause}>{children}</LockOverlay>;

export { lockOverlay };
