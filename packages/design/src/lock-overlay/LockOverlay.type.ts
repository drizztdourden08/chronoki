/* @layer renderer-components @kind types */
import type { ReactNode } from 'react';

interface LockOverlayProps {
  cause: string;
  userMessage?: string;
  onOpenSettings?: () => void;
  children: ReactNode;
}

export type { LockOverlayProps };
