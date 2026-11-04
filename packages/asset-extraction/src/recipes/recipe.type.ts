/* @layer shared-asset-extraction @kind types */
/** One step of a recipe (tools/recipes.py docstring). `sram` and `sram_file` only set the battery RAM the next steps boot with. */
type RecipeStep =
  | { op: 'power_on'; frames: number }
  | { op: 'boot_to_bedroom' }
  | { op: 'pad'; script: string }
  | { op: 'poke'; pokes: string }
  | { op: 'teleport'; scene: number; tx: number; ty: number; facing: number; frames: number; method: string }
  | { op: 'sram'; recipe: string }
  | { op: 'sram_file'; path: string };

/** What the result must be: the location word ($0100) and WRAM bytes, so a wrong state never reaches a generator. */
interface RecipeExpect {
  loc?: number;
  wram: { addr: number; value: number }[];
}

interface Recipe {
  name: string;
  /** The parent recipe, or null for a chain that starts at power-on. */
  from: string | null;
  doc: string;
  steps: RecipeStep[];
  expect: RecipeExpect;
  /** The steps and expect as written, for the cache key (recipes.py key_of hashes them). */
  keyBody: string;
}

type RecipeSet = Map<string, Recipe>;

export type { Recipe, RecipeExpect, RecipeSet, RecipeStep };
