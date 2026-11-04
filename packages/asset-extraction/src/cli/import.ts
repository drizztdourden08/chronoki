/* @layer shared-asset-extraction @kind logic */
import { fileURLToPath } from 'node:url';
import type { registerResolver as registerResolverType } from './register-resolver';
import type { respawnWithJspi as respawnType } from './respawn-with-jspi';
import type { importRom as importRomType } from './import-main';

const resolverModule = './register-resolver.ts';
const { registerResolver } = (await import(resolverModule)) as { registerResolver: typeof registerResolverType };
registerResolver();

const respawnModule = './respawn-with-jspi.ts';
const { respawnWithJspi } = (await import(respawnModule)) as { respawnWithJspi: typeof respawnType };
const respawned = respawnWithJspi(fileURLToPath(import.meta.url), process.argv.slice(2));

if (respawned !== null) {
  process.exitCode = respawned;
} else {
  const mainModule = './import-main.ts';
  const { importRom } = (await import(mainModule)) as { importRom: typeof importRomType };
  process.exitCode = await importRom(process.argv.slice(2)).catch((e: unknown) => {
    process.stderr.write(`import: ${e instanceof Error ? (e.stack ?? e.message) : String(e)}\n`);
    return 1;
  });
}
