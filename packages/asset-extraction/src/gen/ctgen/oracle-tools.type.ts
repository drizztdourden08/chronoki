/* @layer shared-asset-extraction @kind types */
import type { OracleDriver } from '../../oracle/oracle-driver.type';

/** `ct.exe --peek <state> <out> [--btnscript S] [--frames N]`: what it is asked. */
interface PeekRequest {
  state: Uint8Array;
  /** The pad script, already expanded (no groups), or null for none. */
  script: string | null;
  /** CT_ORACLE_LOGICAL=1 (the cartridge under the logical rule), as every recipe is built. */
  rule: boolean;
  frames: number | null;
  /** Extra environment (PEEK_POKE, PEEK_ISOBG). */
  env: Record<string, string>;
}

/** <out>.raw (the 512x480 [pad,B,G,R] framebuffer), .raw.wram, .raw.vram and .raw.oam (OAM + high OAM + CGRAM at 1056). */
interface PeekResult {
  fb: Uint8Array;
  wram: Uint8Array;
  vram: Uint8Array;
  oam: Uint8Array;
}

/** `ct.exe ROM --fb out --frames N` from power-on (PEEK_SAVE: the state of the last frame), with a battery if given (CT_ORACLE_SRAM). */
interface BootRequest {
  frames: number;
  sram: Uint8Array | null;
}

interface BootResult extends PeekResult {
  state: Uint8Array;
}

interface TeleportRequest {
  start: Uint8Array;
  scene: number;
  tx: number;
  ty: number;
  facing: number;
  frames: number;
}

/**
 * What the capture generators (tools/gen/ctgen.py and the ct.exe modes they call) need beyond OracleDriver.runRecipe.
 * The WASM driver (P3) implements it next to OracleDriver; the stages ask for it through `requireTools`.
 */
interface OracleTools extends OracleDriver {
  peek: (request: PeekRequest) => Promise<PeekResult>;
  /** Renamed from `boot`, which OracleDriver already names (the ROM start-up). */
  powerOn: (request: BootRequest) => Promise<BootResult>;
  /** `ct.exe --teleport scene tx ty facing --from start --out o --frames N` under the rule: the state it writes. */
  teleport: (request: TeleportRequest) => Promise<Uint8Array>;
  /** `ct.exe --monitor REGS --from state --frames N` under the rule: its stdout. */
  /** Renamed from `monitor`, which PeekOracle already names (the request form). */
  monitorText: (state: Uint8Array, regs: string, frames: number) => Promise<string>;
  /** `ct.exe --owforce state world out` (the plain oracle): the state it writes. */
  owforce: (state: Uint8Array, world: number) => Promise<Uint8Array>;
}

export type { BootRequest, BootResult, OracleTools, PeekRequest, PeekResult, TeleportRequest };
