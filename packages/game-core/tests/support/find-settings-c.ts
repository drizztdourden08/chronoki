/* @layer tests @kind test-support */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const REFERENCE_SUFFIX = ['setup', 'kit', 'src', 'settings.c'];

const inReferenceFolder = (dir: string): string | null => {
  const root = join(dir, 'chronoki-ref', 'belthasar');
  if (!existsSync(root)) return null;
  const hit = readdirSync(root).map((name) => join(root, name, ...REFERENCE_SUFFIX)).find((file) => existsSync(file));
  return hit ?? null;
};

const inCoreFolder = (dir: string): string | null => {
  const file = join(dir, 'core', 'belthasar', 'src', 'settings.c');
  return existsSync(file) ? file : null;
};

const settingsCPath = (): string | null => {
  const env = process.env.CK_SETTINGS_C;
  if (env && existsSync(env)) return env;
  let dir = process.cwd();
  for (;;) {
    const hit = inCoreFolder(dir) ?? inReferenceFolder(dir);
    if (hit) return hit;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
};

const readSettingsC = (): string | null => {
  const path = settingsCPath();
  return path ? readFileSync(path, 'utf8') : null;
};

export { readSettingsC };
