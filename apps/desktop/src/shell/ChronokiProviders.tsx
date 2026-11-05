/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import { ChronokiControllerReportHost } from '@app/controller-report/ChronokiControllerReportHost';
import { GameSession } from '@app/views/GameSession';
import { McpToolsBridge } from './McpToolsBridge';
import { MsulOpenHost } from './MsulOpenHost';
import { ProfileRemovalGuard } from './ProfileRemovalGuard';

const ChronokiProviders = ({ children }: { children: ReactNode }) => (
  <ChronokiControllerReportHost>
    <GameSession>
      <ProfileRemovalGuard />
      <McpToolsBridge />
      <MsulOpenHost />
      {children}
    </GameSession>
  </ChronokiControllerReportHost>
);

export { ChronokiProviders };
