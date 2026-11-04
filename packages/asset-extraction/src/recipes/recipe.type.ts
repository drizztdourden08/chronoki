/* @layer shared-asset-extraction @kind types */
type RecipeStep =
  | { op: 'power_on'; frames: number }
  | { op: 'boot_to_bedroom' }
  | { op: 'pad'; script: string }
  | { op: 'poke'; pokes: string }
  | { op: 'teleport'; scene: number; tx: number; ty: number; facing: number; frames: number; method: string }
  | { op: 'sram'; recipe: string }
  | { op: 'sram_file'; path: string };

interface RecipeExpect {
  loc?: number;
  wram: { addr: number; value: number }[];
}

interface Recipe {
  name: string;
  from: string | null;
  doc: string;
  steps: RecipeStep[];
  expect: RecipeExpect;
  keyBody: string;
}

type RecipeSet = Map<string, Recipe>;

export type { Recipe, RecipeExpect, RecipeSet, RecipeStep };
