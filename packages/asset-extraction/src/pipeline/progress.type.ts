/* @layer shared-asset-extraction @kind types */
type ProgressKind = 'stage-start' | 'stage-done' | 'stage-skipped' | 'stage-failed' | 'import-done';

interface ProgressEvent {
  kind: ProgressKind;
  stageId: string;
  label: string;
  /** setup.py's "progress K/N": K counts the finished stages flagged `step`, N is their total. */
  step: number;
  steps: number;
  /** 0..1 by stage weight, for a smooth bar (setup.py only counts steps). */
  fraction: number;
  message?: string;
}

type ProgressSink = (event: ProgressEvent) => void;

export type { ProgressEvent, ProgressKind, ProgressSink };
