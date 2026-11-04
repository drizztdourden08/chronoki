/* @layer shared-asset-extraction @kind types */
import type { OracleDriver } from './oracle-driver.type';

/** `ct.exe --peek <state> <out>.raw [--btnscript S] [--frames N]` (ctgen.peek): a state read for some frames, its dumps returned. */
interface PeekRequest {
  state: Uint8Array;
  /** The pad script, already expanded (recipes' grammar), or null for none. */
  script: string | null;
  frames: number | null;
  /** Extra environment (PEEK_ISOBG, ...). */
  env: Record<string, string>;
  /** True runs the cartridge under the logical rule (CT_ORACLE_LOGICAL=1); false is the plain oracle. */
  rule: boolean;
}

/** The dumps of a peek: <out>.raw (the 512x480 [pad,B,G,R] framebuffer), .raw.wram, .raw.vram, .raw.oam. */
interface PeekResult {
  raw: Uint8Array;
  wram: Uint8Array;
  vram: Uint8Array;
  oam: Uint8Array;
}

/**
 * One of ct.exe's tool modes (--sndtiming, --animoplen, --lzpack, --owforce, --owsprite, --owboat, --owbirds), run on
 * the booted ROM under the plain oracle. In `args`, `{state}` is the path of `state`, `{in:NAME}` the path of the
 * input `NAME` and `{out:NAME}` a path in the tool's scratch directory; `outputs` names the files (relative to that
 * directory, so `NAME.wram` for a tool that appends an extension to `{out:NAME}`) read back. The result holds the
 * outputs that exist.
 */
interface ToolRequest {
  args: string[];
  state: Uint8Array | null;
  inputs: Record<string, Uint8Array>;
  outputs: string[];
}

/** What the capture stages need beyond recipe replay; the WASM driver (P3) implements it on top of OracleDriver. */
interface OracleCaptureDriver extends OracleDriver {
  peek: (request: PeekRequest) => Promise<PeekResult>;
  tool: (request: ToolRequest) => Promise<Record<string, Uint8Array>>;
}

export type { OracleCaptureDriver, PeekRequest, PeekResult, ToolRequest };
