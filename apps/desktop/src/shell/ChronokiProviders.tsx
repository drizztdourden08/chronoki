/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import { ChronokiControllerReportHost } from '@app/controller-report/ChronokiControllerReportHost';
import { GameSession } from '@app/views/GameSession';
import { McpToolsBridge } from './McpToolsBridge';
import { ProfileRemovalGuard } from './ProfileRemovalGuard';

const ChronokiProviders = ({ children }: { children: ReactNode }) => (
  <ChronokiControllerReportHost>
    <GameSession>
      <ProfileRemovalGuard />
      <McpToolsBridge />
      {children}
    </GameSession>
  </ChronokiControllerReportHost>
);

export { ChronokiProviders };
