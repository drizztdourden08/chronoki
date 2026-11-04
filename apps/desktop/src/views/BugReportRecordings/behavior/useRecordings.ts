/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { BugReportSectionProps } from '@drizztdourden08/brock-react';
import { deleteDebugCapture } from '@app/bug-report/debug-capture/delete-debug-capture';
import { listDebugCaptures } from '@app/bug-report/debug-capture/list-debug-captures';
import { readCaptureSession } from '@app/bug-report/debug-capture/read-capture-session';
import type { CaptureSummary } from '@app/bug-report/debug-capture/debug-capture.type';
import type { RecordingsModel } from '../BugReportRecordings.type';

const withoutSession = (sessionKey: string) => (now: CaptureSummary[]): CaptureSummary[] => now.filter((session) => session.sessionKey !== sessionKey);

const useRecordings = (profileId: string, setExtras: BugReportSectionProps['setExtras']): RecordingsModel => {
  const [sessions, setSessions] = useState<CaptureSummary[]>([]);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    void listDebugCaptures(profileId).then((list) => {
      if (!live) return;
      setSessions(list);
      setSelected(new Set(list.map((session) => session.sessionKey)));
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, [profileId]);

  useEffect(() => {
    let live = true;
    void Promise.all(sessions.filter((session) => selected.has(session.sessionKey)).map((session) => readCaptureSession(profileId, session.sessionKey)))
      .then((loaded) => {
        if (live) setExtras({ debugCaptures: loaded.filter((session) => session !== null) });
      });
    return () => {
      live = false;
    };
  }, [profileId, sessions, selected, setExtras]);

  const toggleSession = useCallback((sessionKey: string) => {
    setSelected((now) => {
      const next = new Set(now);
      if (!next.delete(sessionKey)) next.add(sessionKey);
      return next;
    });
  }, []);

  const deleteSession = useCallback((sessionKey: string) => {
    void deleteDebugCapture(profileId, sessionKey).then(() => setSessions(withoutSession(sessionKey)));
  }, [profileId]);

  return { sessions, loading, selected, toggleSession, deleteSession };
};

export { useRecordings };
