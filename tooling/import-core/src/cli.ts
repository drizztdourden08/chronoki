#!/usr/bin/env tsx
import { importCore } from "./importer.ts";
import { coreDir } from "./paths.ts";
import { readPin } from "./pin.ts";
import { ImportError } from "./types.ts";
import { verifyCore } from "./verify.ts";

const runCheck = async (): Promise<number> => {
  const pin = await readPin();
  const problems = await verifyCore(pin);
  if (problems.length === 0) {
    console.log(`core/belthasar matches the pin (${pin.tag}, ${pin.commit.slice(0, 10)})`);
    return 0;
  }
  problems.slice(0, 50).forEach((problem) => console.error(`import-core: ${problem}`));
  if (problems.length > 50) console.error(`import-core: ... and ${problems.length - 50} more`);
  return 1;
};

const runImport = async (): Promise<number> => {
  const pin = await readPin();
  const result = await importCore(pin);
  if (result.upToDate) console.log(`core/belthasar already at ${pin.tag}; nothing to do`);
  else console.log(`Imported ${result.manifest?.files.length} files from ${pin.tag} into ${coreDir}`);
  return 0;
};

const main = (): Promise<number> => (process.argv.includes("--check") ? runCheck() : runImport());

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error(`import-core: ${error instanceof ImportError ? error.message : (error as Error).stack}`);
    process.exit(1);
  });
