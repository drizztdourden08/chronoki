/* @layer renderer-lib @kind types */
type CaptureEventKind = 'log' | 'input' | 'frame';

interface CaptureEvent {
  at: number;
  kind: CaptureEventKind;
  text: string;
}

interface CaptureSession {
  sessionKey: string;
  profileId: string;
  startedAt: number;
  endedAt: number;
  events: CaptureEvent[];
}

interface CaptureSummary {
  sessionKey: string;
  profileId: string;
  startedAt: number;
  endedAt: number;
  eventCount: number;
}

interface CaptureRun {
  session: CaptureSession;
  stops: Array<() => void>;
}

export type { CaptureEvent, CaptureEventKind, CaptureRun, CaptureSession, CaptureSummary };
