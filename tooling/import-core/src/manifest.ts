import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { manifestName } from "./paths.ts";
import { extraFiles, isImported } from "./rules.ts";
import type { ImportedFile, Manifest, Pin } from "./types.ts";

export const sha256Of = async (file: string): Promise<string> =>
  createHash("sha256").update(await readFile(file)).digest("hex");

export const walk = async (root: string, rel = "", skipGit = true): Promise<string[]> => {
  const entries = await readdir(join(root, rel), { withFileTypes: true });
  const found = await Promise.all(
    entries.map(async (entry) => {
      const path = rel ? `${rel}/${entry.name}` : entry.name;
      if (skipGit && entry.name === ".git") return [];
      return entry.isDirectory() ? walk(root, path, skipGit) : [path];
    }),
  );
  return found.flat();
};

export const selectFiles = async (sourceDir: string): Promise<string[]> => {
  const all = await walk(sourceDir);
  const present = new Set(all);
  const wanted = all.filter(isImported);
  const extras = extraFiles.filter((file) => present.has(file));
  return [...new Set([...extras, ...wanted])].sort();
};

export const hashFiles = async (dir: string, paths: string[]): Promise<ImportedFile[]> =>
  Promise.all(paths.map(async (path) => ({ path, sha256: await sha256Of(join(dir, path)) })));

export const buildManifest = (pin: Pin, files: ImportedFile[]): Manifest => ({
  repo: pin.repo,
  tag: pin.tag,
  commit: pin.commit,
  licence: pin.licence,
  date: new Date().toISOString(),
  files,
});

export const writeManifest = (dir: string, manifest: Manifest): Promise<void> =>
  writeFile(join(dir, manifestName), `${JSON.stringify(manifest, null, 2)}\n`);

export const readManifest = async (dir: string): Promise<Manifest | undefined> => {
  try {
    return JSON.parse(await readFile(join(dir, manifestName), "utf8")) as Manifest;
  } catch {
    return undefined;
  }
};
