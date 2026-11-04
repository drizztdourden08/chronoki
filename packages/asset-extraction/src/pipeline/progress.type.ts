/* @layer shared-asset-extraction @kind types */
type ProgressKind = 'stage-start' | 'stage-done' | 'stage-skipped' | 'stage-failed' | 'import-done';

interface ProgressEvent {
  kind: ProgressKind;
  stageId: string;
  label: string;
  step: number;
  steps: number;
  fraction: number;
  message?: string;
}

type ProgressSink = (event: ProgressEvent) => void;

export type { ProgressEvent, ProgressKind, ProgressSink };
