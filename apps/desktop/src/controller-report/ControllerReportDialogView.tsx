/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { useDebugText, useProduct } from '@drizztdourden08/brock-react';
import { ControllerReportDialog } from '@drizztdourden08/brock-input/renderer';
import type { ControllerReportSubmission } from '@drizztdourden08/brock-input/renderer';
import { submitControllerReport } from './submit-controller-report';
import type { ControllerReportDialogViewProps } from './ControllerReportDialogView.type';

const ControllerReportDialogView = ({ deviceKey, onClose }: ControllerReportDialogViewProps) => {
  const { repo } = useProduct();
  const { text } = useDebugText();
  const submit = useCallback((submission: ControllerReportSubmission) => submitControllerReport(repo, submission), [repo]);

  return <ControllerReportDialog open deviceKey={deviceKey} onClose={onClose} identity={null} debugText={text} submit={submit} />;
};

export { ControllerReportDialogView };
