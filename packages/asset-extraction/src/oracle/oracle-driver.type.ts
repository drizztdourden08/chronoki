/* @layer shared-asset-extraction @kind types */
import type { RecipeStep } from '../recipes/recipe.type';

/**
 * One recipe run, as the oracle sees it. `steps` are the executable steps only (power_on, boot_to_bedroom, pad,
 * poke, teleport); the `sram` / `sram_file` steps are resolved by the replay code into `sram` (the battery RAM the
 * oracle boots with, CT_ORACLE_SRAM). `pad` scripts arrive already expanded.
 */
interface OracleRun {
  name: string;
  steps: RecipeStep[];
  /** The parent's state (the `--peek <state>` start), or null for a chain that starts at power-on. */
  parentState: Uint8Array | null;
  sram: Uint8Array | null;
}

/** The last step's sidecars (<state>.raw.wram / .vram / .oam), which the capture generators read. */
interface OracleResult {
  state: Uint8Array;
  sidecars: Partial<Record<'wram' | 'vram' | 'oam', Uint8Array>>;
}

/**
 * The emulator oracle (Belthasar's ct.exe, built to WASM in phase P3). Only this interface lives here: the stages
 * drive it, and the WASM driver implements it. Runs the cartridge under the logical rule (CT_ORACLE_LOGICAL=1).
 */
interface OracleDriver {
  /** Identifies the oracle build; part of every recipe's cache key. */
  readonly tag: string;
  boot: (rom: Uint8Array) => Promise<void>;
  /** Replays a recipe from its parent's state: the state bytes (and sidecars) of its last step. */
  runRecipe: (run: OracleRun) => Promise<OracleResult>;
  dispose: () => Promise<void>;
}

export type { OracleDriver, OracleResult, OracleRun };
