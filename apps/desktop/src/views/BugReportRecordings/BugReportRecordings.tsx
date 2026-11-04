/* @layer renderer-app @kind component */
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { useAllowDebugLogging } from '@app/bug-report/debug-capture/useAllowDebugLogging';
import { RecordingsPicker } from './sub-components/RecordingsPicker';
import type { BugReportRecordingsProps } from './BugReportRecordings.type';
import './BugReportRecordings.css';

const BugReportRecordings = ({ setExtras, disabled }: BugReportRecordingsProps) => {
  const profileId = useProfilesStore((state) => state.active?.id ?? null);
  const allowDebugLogging = useAllowDebugLogging();
  if (profileId === null || !allowDebugLogging) return null;
  return <RecordingsPicker profileId={profileId} setExtras={setExtras} disabled={disabled} />;
};

export { BugReportRecordings };
