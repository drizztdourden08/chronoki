/* @layer shared-asset-extraction @kind types */
import type { RecipeStep } from '../recipes/recipe.type';

interface OracleRun {
  name: string;
  steps: RecipeStep[];
  parentState: Uint8Array | null;
  sram: Uint8Array | null;
}

interface OracleResult {
  state: Uint8Array;
  sidecars: Partial<Record<'wram' | 'vram' | 'oam', Uint8Array>>;
}

interface OracleDriver {
  readonly tag: string;
  boot: (rom: Uint8Array) => Promise<void>;
  runRecipe: (run: OracleRun) => Promise<OracleResult>;
  dispose: () => Promise<void>;
}

export type { OracleDriver, OracleResult, OracleRun };
