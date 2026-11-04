/* @layer shared-asset-extraction @kind logic */
import type { Recipe, RecipeExpect, RecipeStep } from './recipe.type';

type Json = unknown;

const asString = (v: Json, what: string): string => {
  if (typeof v !== 'string') throw new Error(`recipe: ${what} must be a string`);
  return v;
};

const asNumber = (v: Json, what: string): number => {
  if (typeof v !== 'number') throw new Error(`recipe: ${what} must be a number`);
  return v;
};

const parseStep = (raw: Json, recipe: string): RecipeStep => {
  if (!Array.isArray(raw) || typeof raw[0] !== 'string') throw new Error(`recipe ${recipe}: a step is [op, args...]`);
  const [op, a, b, c, d, e, f] = raw as Json[];
  switch (op) {
    case 'power_on':
      return { op, frames: asNumber(a, 'power_on frames') };
    case 'boot_to_bedroom':
      return { op };
    case 'pad':
      return { op, script: asString(a, 'pad script') };
    case 'poke':
      return { op, pokes: asString(a, 'poke list') };
    case 'teleport':
      return {
        op,
        scene: asNumber(a, 'teleport scene'),
        tx: asNumber(b, 'teleport x'),
        ty: asNumber(c, 'teleport y'),
        facing: asNumber(d, 'teleport facing'),
        frames: asNumber(e, 'teleport frames'),
        method: f === undefined ? 'jmp' : asString(f, 'teleport method'),
      };
    case 'sram':
      return { op, recipe: asString(a, 'sram recipe') };
    case 'sram_file':
      return { op, path: asString(a, 'sram_file path') };
    default:
      throw new Error(`recipe ${recipe}: unknown step ${String(op)}`);
  }
};

const parseExpect = (raw: Json): RecipeExpect => {
  const exp = (raw ?? {}) as { loc?: string; wram?: Record<string, string> };
  return {
    loc: exp.loc === undefined ? undefined : Number.parseInt(exp.loc, 16),
    wram: Object.entries(exp.wram ?? {}).map(([addr, value]) => ({
      addr: Number.parseInt(addr, 16),
      value: Number.parseInt(value, 16),
    })),
  };
};

/** A recipe from its JSON text (tools/recipes/<name>.json). */
const parseRecipe = (text: string): Recipe => {
  const r = JSON.parse(text) as { name?: string; from?: string; doc?: string; steps?: Json[]; expect?: Json };
  const name = asString(r.name, 'name');
  return {
    name,
    from: r.from ?? null,
    doc: r.doc ?? '',
    steps: (r.steps ?? []).map((s) => parseStep(s, name)),
    expect: parseExpect(r.expect),
    keyBody: JSON.stringify([r.steps ?? null, r.expect ?? null]),
  };
};

export { parseRecipe };
