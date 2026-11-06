/* @layer tests @kind helper */
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import { SUPPORTED_AP_VERSIONS, WORLD_MODULE_NAME } from '@chronoki/game-core/archipelago';
import { createApworldRig } from '@drizztdourden08/brock-randomizer/test-kit';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..', '..', '..');
const BUILT_DIR = path.join(ROOT, 'apps', 'desktop', 'build', 'archipelago');
const SPOILER_SUFFIX = '_Spoiler.txt';

const builtPackagePath = (version: string): string => {
  const file = readdirSync(BUILT_DIR).find((name) => name.endsWith('.apworld') && name.includes(version));
  if (file === undefined) throw new Error(`no ${WORLD_MODULE_NAME} package for Archipelago ${version} in ${BUILT_DIR}`);
  return path.join(BUILT_DIR, file);
};

const readSpoiler = async (archive: Buffer): Promise<string | null> => {
  const zip = await JSZip.loadAsync(archive);
  const entry = Object.values(zip.files).find((file) => file.name.endsWith(SPOILER_SUFFIX));
  return entry === undefined ? null : entry.async('string');
};

const ctApworldRig = createApworldRig({
  apDir: process.env.CHRONOKI_AP_DIR ?? 'C:/ProgramData/Archipelago',
  root: ROOT,
  buildScript: path.join(HERE, 'build-ct-apworld.mjs'),
  worldModuleName: WORLD_MODULE_NAME,
  supportedVersions: SUPPORTED_AP_VERSIONS,
  builtPackagePath,
  readSpoiler,
  tempPrefix: 'chronoki-apworld-',
});

export { ctApworldRig };
