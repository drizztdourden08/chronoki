/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import { GameSession } from '@app/views/GameSession';
import { ProfileRemovalGuard } from './ProfileRemovalGuard';

const ChronokiProviders = ({ children }: { children: ReactNode }) => (
  <GameSession>
    <ProfileRemovalGuard />
    {children}
  </GameSession>
);

export { ChronokiProviders };
