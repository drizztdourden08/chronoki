/* @layer shared-asset-extraction @kind types */

interface PeekRequest {
  state: Uint8Array;
  script: string | null;
  env?: Record<string, string>;
  rule?: boolean;
  frames?: number;
  save?: boolean;
}

interface PeekDump {
  fb: Uint8Array;
  wram: Uint8Array;
  vram: Uint8Array;
  oam: Uint8Array;
  state?: Uint8Array;
}

interface PeekShotsRequest extends PeekRequest {
  at: number[];
}

interface MonitorRequest {
  state: Uint8Array;
  regions: string;
  env?: Record<string, string>;
  script?: string | null;
  frames?: number;
  rule?: boolean;
}

interface PeekOracle {
  peek: (req: PeekRequest) => Promise<PeekDump>;
  peekShots: (req: PeekShotsRequest) => Promise<Map<number, PeekDump>>;
  monitor: (req: MonitorRequest) => Promise<string[]>;
}

export type { MonitorRequest, PeekDump, PeekOracle, PeekRequest, PeekShotsRequest };
