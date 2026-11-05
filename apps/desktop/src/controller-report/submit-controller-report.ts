/* @layer renderer-app @kind logic */
import { buildIssueUrl, openExternal, toast, writeClipboard } from '@drizztdourden08/brock-react';
import type { ControllerReportSubmission, FiledControllerReport } from '@drizztdourden08/brock-input/renderer';
import type { ProductRepo } from '@drizztdourden08/brock-core';
import { CLIPBOARD_REPORT_ID, COPIED_MESSAGE, COPY_FAILED_MESSAGE, OPENED_MESSAGE } from './controller-report.constants';
import { buildControllerReportText } from './build-controller-report-text';

const submitControllerReport = async (repo: ProductRepo | undefined, submission: ControllerReportSubmission): Promise<FiledControllerReport | null> => {
  const description = buildControllerReportText(submission);
  if (repo) {
    const issueUrl = buildIssueUrl({ repo, title: submission.subject, description, diagnostics: null });
    openExternal(issueUrl);
    toast(OPENED_MESSAGE, { variant: 'success' });
    return { reportId: issueUrl, issueUrl };
  }
  const copied = await writeClipboard(`${submission.subject}\n\n${description}`);
  toast(copied ? COPIED_MESSAGE : COPY_FAILED_MESSAGE, { variant: copied ? 'success' : 'danger' });
  return copied ? { reportId: CLIPBOARD_REPORT_ID, issueUrl: '' } : null;
};

export { submitControllerReport };
