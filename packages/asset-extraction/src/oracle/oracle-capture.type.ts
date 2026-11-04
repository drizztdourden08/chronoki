/* @layer shared-asset-extraction @kind types */

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

/** What the capture stages need beyond PeekOracle; the WASM driver (P3) implements it next to OracleDriver. */
interface ToolOracle {
  tool: (request: ToolRequest) => Promise<Record<string, Uint8Array>>;
}

export type { ToolOracle, ToolRequest };
