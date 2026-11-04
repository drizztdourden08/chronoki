/* @layer shared-asset-extraction @kind logic */
import type { OracleRun } from '../oracle/oracle-driver.type';
import { createLimiter } from '../pipeline/limit';
import { requireBytes } from '../pipeline/require-bytes';

import { sha1Hex } from '../rom/sha1';
import { checkExpect } from './check-expect';
import { expandPadScript } from './expand-pad-script';
import { chainOf } from './recipe-chain';
import { closureOf } from './closure-of';
import { recipeKey } from './recipe-key';
import { readCached, writeCached } from './recipe-store';
import { sramOf } from './sram-of';
import type { Recipe } from './recipe.type';
import type { MakerEnv } from './recipe-maker.type';

const isExecutable = (op: string): boolean => op !== 'sram' && op !== 'sram_file';

const createRecipeMaker = (env: MakerEnv) => {
  const limit = createLimiter(env.jobs);
  const inflight = new Map<string, Promise<Uint8Array>>();
  const fileHashes = new Map<string, string>();
  const keyOf = (name: string): string =>
    recipeKey(
      {
        recipes: env.recipes,
        romSha1: env.romSha1,
        oracleTag: env.oracle.tag,
        fileHash: (path) => fileHashes.get(path) ?? path,
      },
      name,
    );

  const sramFor = async (r: Recipe): Promise<Uint8Array | null> => {
    let sram: Uint8Array | null = null;
    for (const step of r.steps) {
      if (step.op === 'sram') sram = sramOf(await make(step.recipe));
      else if (step.op === 'sram_file') sram = await requireBytes(env.work, step.path);
    }
    return sram;
  };

  const build = async (r: Recipe, key: string): Promise<Uint8Array> => {
    const parentState = r.from ? await make(r.from) : null;
    const sram = await sramFor(r);
    if (r.steps.length === 0 && parentState === null) throw new Error(`recipe ${r.name}: no steps and no parent`);
    env.log(`recipe ${r.name}: building`);
    const steps = r.steps
      .filter((s) => isExecutable(s.op))
      .map((s) => (s.op === 'pad' ? { ...s, script: expandPadScript(s.script) } : s));
    const run: OracleRun = { name: r.name, steps, parentState, sram };
    const result = await limit(() => env.oracle.runRecipe(run));
    const bad = checkExpect(r.expect, result.state);
    if (bad.length > 0) throw new Error(`recipe ${r.name}: the result is not what the recipe expects: ${bad.join('; ')}`);
    await writeCached(env.work, r.name, key, result);
    return result.state;
  };

  const make = (name: string, force = false): Promise<Uint8Array> => {
    const known = inflight.get(name);
    if (known) return known;
    const task = (async () => {
      const r = chainOf(env.recipes, name).at(-1) as Recipe;
      for (const s of chainOf(env.recipes, name).flatMap((c) => c.steps)) {
        if (s.op === 'sram_file' && !fileHashes.has(s.path)) {
          fileHashes.set(s.path, sha1Hex(await requireBytes(env.work, s.path)));
        }
      }
      const key = keyOf(name);
      const cached = force ? null : await readCached(env.work, name, key);
      if (cached) {
        env.log(`recipe ${name}: cached`);
        return cached;
      }
      return build(r, key);
    })();
    inflight.set(name, task);
    return task;
  };

  const makeMany = async (names: string[], force = false): Promise<Map<string, Uint8Array>> => {
    const need = [...closureOf(env.recipes, names)].sort();
    const entries = await Promise.all(need.map(async (n) => [n, await make(n, force && names.includes(n))] as const));
    return new Map(entries);
  };

  return { make, makeMany };
};

export { createRecipeMaker };
