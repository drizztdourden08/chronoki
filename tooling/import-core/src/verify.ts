import { join } from "node:path";
import { coreDir, manifestName } from "./paths.ts";
import { readManifest, sha256Of, walk } from "./manifest.ts";
import type { Pin } from "./types.ts";

// Returns the list of problems; empty means core/belthasar/ is exactly what the pin describes.
export const verifyCore = async (pin: Pin, dir = coreDir): Promise<string[]> => {
  const manifest = await readManifest(dir);
  if (!manifest) return [`${dir} has no readable ${manifestName}; run the import`];
  const problems: string[] = [];
  if (manifest.commit !== pin.commit) problems.push(`imported commit ${manifest.commit} differs from the pin ${pin.commit}`);
  if (manifest.tag !== pin.tag) problems.push(`imported tag ${manifest.tag} differs from the pin ${pin.tag}`);
  if (manifest.repo !== pin.repo) problems.push(`imported repo ${manifest.repo} differs from the pin ${pin.repo}`);
  const listed = new Set(manifest.files.map((file) => file.path));
  for (const file of manifest.files) {
    try {
      if ((await sha256Of(join(dir, file.path))) !== file.sha256) problems.push(`modified: ${file.path}`);
    } catch {
      problems.push(`missing: ${file.path}`);
    }
  }
  for (const path of await walk(dir, "", false)) {
    if (path !== manifestName && !listed.has(path)) problems.push(`unlisted extra file: ${path}`);
  }
  return problems;
};
