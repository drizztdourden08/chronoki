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

type InputProbeEntry = {
  probe: 'input';
  ok: boolean;
  buttons: string[];
  masks: number[];
  screenStatic: boolean;
  before: string;
  after: string;
  errors: string[];
};

type SramProbeEntry = {
  probe: 'sram';
  ok: boolean;
  original: number | null;
  stored: number | null;
  pattern: number;
  patternStored: boolean;
  restored: boolean;
  errors: string[];
};

type EventLogEntry = FramesProbeEntry | StateProbeEntry | InputProbeEntry | SramProbeEntry;

export type { EventLogEntry, FramesProbeEntry, InputProbeEntry, SramProbeEntry, StateProbeEntry };
