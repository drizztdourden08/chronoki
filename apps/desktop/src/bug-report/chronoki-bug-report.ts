/* @layer renderer-app @kind logic */
import type { BrockAppBugReport } from '@drizztdourden08/brock-react';
import { BugReportRecordings } from '@app/views/BugReportRecordings';

const chronokiBugReport: BrockAppBugReport = { contact: true, attachments: true, section: BugReportRecordings };

export { chronokiBugReport };
