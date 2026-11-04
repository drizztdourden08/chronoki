/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { ScrollArea, Stack } from '@drizztdourden08/tessera/primitives';
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListRowState } from '@drizztdourden08/tessera/composites';
import type { CaptureSummary } from '@app/bug-report/debug-capture/debug-capture.type';
import { recordingId } from '../behavior/recording-id';
import { recordingName } from '../behavior/recording-name';
import { useRecordings } from '../behavior/useRecordings';
import { NONE_MESSAGE, TITLE, UNDO_MS } from '../BugReportRecordings.constants';
import type { RecordingsPickerProps } from '../BugReportRecordings.type';
import { IncludeButton } from './IncludeButton';

const render = (session: CaptureSummary) => ({ meta: `${session.eventCount} events` });

const RecordingsPicker = ({ profileId, setExtras, disabled }: RecordingsPickerProps) => {
  const { sessions, loading, selected, toggleSession, deleteSession } = useRecordings(profileId, setExtras);

  const rowActions = useCallback((session: CaptureSummary, row: ItemListRowState) => (
    <IncludeButton
      included={selected.has(session.sessionKey)}
      name={recordingName(session)}
      disabled={disabled}
      tabIndex={row.tabIndex}
      onToggle={() => toggleSession(session.sessionKey)}
    />
  ), [selected, disabled, toggleSession]);

  return (
    <Stack gap="sm">
      <ScrollArea className="bug-report-recordings__list">
        <ItemList
          title={TITLE}
          items={sessions}
          getId={recordingId}
          getName={recordingName}
          render={render}
          rowActions={rowActions}
          actionVisibility="always"
          onActivate={toggleSession}
          onDelete={deleteSession}
          undoDelete={UNDO_MS}
          deleteKey
          filter={false}
          loading={loading}
          empty={NONE_MESSAGE}
        />
      </ScrollArea>
    </Stack>
  );
};

export { RecordingsPicker };
