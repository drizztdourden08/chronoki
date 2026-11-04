/* @layer shared-types @kind types */
type FramesProbeEntry = {
  probe: 'frames';
  presented: number;
  width: number;
  height: number;
  audioFrames: number;
  coreStatus: string;
  errors: string[];
};

type StateProbeEntry = { probe: 'state'; save: string; load: string };

type EventLogEntry = FramesProbeEntry | StateProbeEntry;

export type { EventLogEntry, FramesProbeEntry, StateProbeEntry };
