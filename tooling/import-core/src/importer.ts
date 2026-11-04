import { cp, mkdir, rename, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fetchPinned } from "./fetch.ts";
import { assertMitLicence } from "./licence.ts";
import { buildManifest, hashFiles, selectFiles, writeManifest } from "./manifest.ts";
import { coreDir } from "./paths.ts";
import { ImportError } from "./types.ts";
import type { Manifest, Pin } from "./types.ts";
import { verifyCore } from "./verify.ts";

const copyFiles = async (from: string, to: string, paths: string[]): Promise<void> => {
  for (const path of paths) {
    await mkdir(dirname(join(to, path)), { recursive: true });
    await cp(join(from, path), join(to, path));
  }
};

const hasMatchingImport = async (pin: Pin): Promise<boolean> => (await verifyCore(pin)).length === 0;

export const importCore = async (pin: Pin): Promise<{ manifest?: Manifest; upToDate: boolean }> => {
  if (await hasMatchingImport(pin)) return { upToDate: true };
  const { dir, temp } = await fetchPinned(pin);
  const staging = `${coreDir}.staging`;
  try {
    await assertMitLicence(dir);
    const paths = await selectFiles(dir);
    if (!paths.includes("LICENSE") || paths.length < 10) {
      throw new ImportError(`Only ${paths.length} core files found in the fetched source; the layout changed`);
    }
    await rm(staging, { recursive: true, force: true });
    await copyFiles(dir, staging, paths);
    const manifest = buildManifest(pin, await hashFiles(staging, paths));
    await writeManifest(staging, manifest);
    await rm(coreDir, { recursive: true, force: true });
    await rename(staging, coreDir);
    return { manifest, upToDate: false };
  } finally {
    await rm(staging, { recursive: true, force: true });
    await rm(temp, { recursive: true, force: true });
  }
};
