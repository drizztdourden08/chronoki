/* @layer tests @kind helper */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const build = spawnSync('pnpm', ['apworld'], { cwd: APP_DIR, encoding: 'utf8', shell: true, windowsHide: true });
process.stdout.write(build.stdout ?? '');
process.stderr.write(build.stderr ?? '');
process.exit(build.status ?? 1);
