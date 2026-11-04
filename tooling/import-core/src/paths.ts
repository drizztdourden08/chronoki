import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export const repoRoot = resolve(here, "..", "..", "..");
export const pinPath = join(repoRoot, "core", "belthasar.pin.json");
export const coreDir = join(repoRoot, "core", "belthasar");
export const manifestName = ".import.json";
