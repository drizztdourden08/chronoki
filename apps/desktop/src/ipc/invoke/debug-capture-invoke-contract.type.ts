/* @layer shared-types @kind types */
import type {
  DebugCaptureDeleteSessionResult, DebugCaptureFinalizeInput, DebugCaptureFinalizeResult, DebugCaptureSessionSummary,
} from '@app/debug-report';

interface DebugCaptureInvokeContract {
  'debug-capture:finalizeSession': (input: DebugCaptureFinalizeInput) => Promise<DebugCaptureFinalizeResult>;
  'debug-capture:listSessions': (input: { profileId: string }) => Promise<DebugCaptureSessionSummary[]>;
  'debug-capture:deleteSession': (input: { profileId: string; sessionKey: string }) => Promise<DebugCaptureDeleteSessionResult>;
}

export type { DebugCaptureInvokeContract };
