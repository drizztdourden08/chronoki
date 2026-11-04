/* @layer shared-asset-extraction @kind types */

/** ct.exe --peek <state> <out> --btnscript <script>: one run from a state, the dumps of its last frame. */
interface PeekRequest {
  state: Uint8Array;
  /** The button script (`hexbtn:frames,...`, recipes' grammar), or null for none. */
  script: string | null;
  /** Extra environment (PEEK_ISOBG, ...), on top of the SDL dummy drivers. */
  env?: Record<string, string>;
  /** Run the cartridge under the rule (CT_ORACLE_LOGICAL=1); the default. */
  rule?: boolean;
  frames?: number;
  /** Also return the state of the last frame (PEEK_SAVE) as PeekDump.state. */
  save?: boolean;
}

/** The four dumps of a peek: <out>.raw (512x480 [pad,B,G,R] framebuffer), .raw.wram, .raw.vram, .raw.oam (1568 bytes). */
interface PeekDump {
  fb: Uint8Array;
  wram: Uint8Array;
  vram: Uint8Array;
  oam: Uint8Array;
  /** The state of the last frame, when the request asked for it (save). */
  state?: Uint8Array;
}

/** ctlib/peekshots.shots: the dump after each wanted frame of one run. */
interface PeekShotsRequest extends PeekRequest {
  at: number[];
}

/** ct.exe --monitor <regions> --from <state> [--btnscript S] --frames N: the printed text, one line per frame. */
interface MonitorRequest {
  state: Uint8Array;
  regions: string;
  /** Extra environment (PEEK_POKE, ...). */
  env?: Record<string, string>;
  script?: string | null;
  frames?: number;
  rule?: boolean;
}

/**
 * What the generators need of the oracle beyond OracleDriver.runRecipe (ct.exe --peek / --monitor). The WASM
 * driver of phase P3 implements it next to OracleDriver; a driver without it fails the oracle generators with a clear message.
 */
interface PeekOracle {
  peek: (req: PeekRequest) => Promise<PeekDump>;
  peekShots: (req: PeekShotsRequest) => Promise<Map<number, PeekDump>>;
  monitor: (req: MonitorRequest) => Promise<string[]>;
}

export type { MonitorRequest, PeekDump, PeekOracle, PeekRequest, PeekShotsRequest };
