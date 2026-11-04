// Probe 2: time one oracle replay (the ct_oracle module: the vendored SNES core running the cartridge) against the
// test ROM, for a few power-on frame counts and the scripted run, each in a fresh module. Prints ms and a framebuffer hash.
//   node core/wasm-build/probe/oracle.mjs [--rom <sfc>] [--frames 60,300,600]
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const argValue = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const rom = argValue('--rom', 'X:/chronoki/test-roms/Chrono Trigger (USA).sfc');
const counts = argValue('--frames', '60,300,600').split(',').map(Number);

const glue = join(here, '..', 'out', 'chronoki-oracle.js');
if (!existsSync(glue)) {
  console.error('not built: node core/wasm-build/build.mjs');
  process.exit(1);
}
const romBytes = readFileSync(rom);
const factory = createRequire(import.meta.url)(glue);

const replay = async (label, extra, n) => {
  const opts = {
    print: () => {},
    printErr: (s) => console.error(`[oracle!] ${s}`),
    preRun: [() => { opts.ENV.CT_ORACLE_LOGICAL = '1'; }],   // the rule the oracle replays under (CLAUDE.md of Belthasar)
  };
  const m = await factory(opts);
  m.FS.writeFile('/rom.sfc', romBytes);
  const t0 = performance.now();
  let status = 0;
  try {
    status = m.callMain(['/rom.sfc', '--frames', String(n), '--fb', '/out.fb', ...extra]) ?? 0;
  } catch (e) {
    status = e && e.status !== undefined ? e.status : `threw ${e}`;
  }
  const ms = performance.now() - t0;
  let hash = 'none';
  let size = 0;
  try {
    const fb = m.FS.readFile('/out.fb');
    size = fb.length;
    hash = createHash('sha256').update(fb).digest('hex').slice(0, 16);
  } catch { /* no framebuffer written */ }
  console.log(`${label.padEnd(18)} frames ${String(n).padStart(5)}  ${ms.toFixed(0).padStart(7)} ms  ${(ms / n).toFixed(2)} ms/frame  exit ${status}  fb ${size} bytes ${hash}`);
};

for (const n of counts) await replay('power-on', [], n);
await replay('scripted (--script)', ['--script'], counts[counts.length - 1]);
