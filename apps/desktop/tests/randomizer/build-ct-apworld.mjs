/* @layer tests @kind helper */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const ENTRY = '../../packages/game-core/src/randomizer/archipelago/index.ts';
const STEPS = [
  ['apworld', 'export', '--entry', ENTRY, '--fn', 'exportCtWorld'],
  ['apworld', 'build', '--ap-version', '0.6.6', '--ap-version', '0.6.7', '--ap-version', '0.6.8', '--ap-public', 'public/archipelago'],
];

for (const step of STEPS) {
  const run = spawnSync('pnpm', ['exec', 'brock', ...step], { cwd: APP_DIR, encoding: 'utf8', shell: true, windowsHide: true });
  process.stdout.write(run.stdout ?? '');
  process.stderr.write(run.stderr ?? '');
  if (run.status !== 0) process.exit(run.status ?? 1);
}
