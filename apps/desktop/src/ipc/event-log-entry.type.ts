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
  mode: 'press' | 'none';
  frame: number;
  hash: string;
  masks: number[];
  errors: string[];
};

type SramProbeEntry = {
  probe: 'sram';
  ok: boolean;
  original: number | null;
  stored: number | null;
  pattern: number;
  patternStored: boolean;
  restored: boolean | 'removed';
  identical: boolean;
  errors: string[];
};

type HostProbeEntry = {
  probe: 'host';
  ok: boolean;
  turbo: { expected: boolean; extraFrames: number; heldDuring: boolean; restored: boolean };
  autoSave: { expected: boolean; created: number };
  saveOnQuit: { expected: boolean; created: number };
  errors: string[];
};

type EventLogEntry = FramesProbeEntry | StateProbeEntry | InputProbeEntry | SramProbeEntry | HostProbeEntry;

export type { EventLogEntry, FramesProbeEntry, HostProbeEntry, InputProbeEntry, SramProbeEntry, StateProbeEntry };
