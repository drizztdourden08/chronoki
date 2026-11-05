/* @layer renderer-app @kind component */
import type { ReactNode } from 'react';
import { ControllerReportHost } from '@drizztdourden08/brock-input/renderer';
import { ControllerReportDialogView } from './ControllerReportDialogView';

const renderDialog = (deviceKey: string, onClose: () => void): ReactNode => <ControllerReportDialogView deviceKey={deviceKey} onClose={onClose} />;

const ChronokiControllerReportHost = ({ children }: { children: ReactNode }) => (
  <ControllerReportHost renderDialog={renderDialog}>{children}</ControllerReportHost>
);

export { ChronokiControllerReportHost };
