/* @layer renderer-app @kind types */
import type { BugReportSectionProps } from '@drizztdourden08/brock-react';
import type { CaptureSummary } from '@app/bug-report/debug-capture/debug-capture.type';

type BugReportRecordingsProps = BugReportSectionProps;

interface RecordingsPickerProps {
  profileId: string;
  setExtras: BugReportSectionProps['setExtras'];
  disabled: boolean;
}

interface IncludeButtonProps {
  included: boolean;
  name: string;
  disabled: boolean;
  tabIndex?: number;
  onToggle: () => void;
}

interface RecordingsModel {
  sessions: CaptureSummary[];
  loading: boolean;
  selected: ReadonlySet<string>;
  toggleSession: (sessionKey: string) => void;
  deleteSession: (sessionKey: string) => void;
}

export type { BugReportRecordingsProps, IncludeButtonProps, RecordingsModel, RecordingsPickerProps };
