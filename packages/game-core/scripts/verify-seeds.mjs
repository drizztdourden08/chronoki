import { createServer } from 'vite';

const server = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true },
});

let code = 1;
try {
  const { runVerifyCli } = await server.ssrLoadModule('/src/randomizer/verify/run-verify-cli.ts');
  code = runVerifyCli(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  await server.close();
}
process.exit(code);
