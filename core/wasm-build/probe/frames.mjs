// Probe 1: load the built game module with the reference ct_assets.dat in its file system, run N frames through
// CkRunFrame (the same synchronous call port-kit makes), print frames, ms per frame and a framebuffer hash.
//   node core/wasm-build/probe/frames.mjs [N=600] [--assets <ct_assets.dat>] [--tables <ct_tables.dat>]
// Exit codes: 0 ran, 2 the engine stopped early (its message is printed: the table-pack mismatch of unknown 2 shows here),
// 3 no frame was ever presented (the JSPI loop of unknown 1 did not run).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// JSPI is behind a flag in Node 24's V8: re-run this file with it
if (!process.execArgv.includes('--experimental-wasm-jspi')) {
  const r = spawnSync(process.execPath, ['--experimental-wasm-jspi', fileURLToPath(import.meta.url), ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

const argValue = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const frames = Number(process.argv.slice(2).find((a) => /^\d+$/.test(a)) ?? 600);
const assets = argValue('--assets', 'X:/chronoki-ref/out/ct_assets.dat');
const tables = argValue('--tables', join(dirname(assets), 'ct_tables.dat'));

const glue = join(here, '..', 'out', 'chronoki-core.js');
if (!existsSync(glue)) {
  console.error('not built: node core/wasm-build/build.mjs');
  process.exit(1);
}
const lines = [];
const factory = createRequire(import.meta.url)(glue);
const m = await factory({ print: (s) => { lines.push(s); console.log(`[engine] ${s}`); }, printErr: (s) => console.error(`[engine!] ${s}`) });

m.FS.writeFile('/ct_assets.dat', readFileSync(assets));
if (existsSync(tables)) m.FS.writeFile('/ct_tables.dat', readFileSync(tables));
m.FS.mkdir('/saves');

let stopped = null;
Promise.resolve(m.callMain([])).then((code) => { stopped = code ?? 0; }, (e) => { stopped = `error: ${e}`; });

const tick = () => new Promise((r) => setTimeout(r, 0));
const t0 = performance.now();
let audioFrames = 0;
for (let i = 0; i < frames && stopped === null; i++) {
  m._CkRunFrame();
  await tick();
  audioFrames += m._CkSampleCount();
}
const ms = performance.now() - t0;

const presented = m._CkFrameCount();
const w = m._CkFrameWidth();
const h = m._CkFrameHeight();
const ptr = m._CkFramePtr();
const hash = ptr ? createHash('sha256').update(m.HEAPU8.subarray(ptr, ptr + w * h * 4)).digest('hex').slice(0, 16) : 'none';
console.log(`frames requested ${frames}, presented ${presented}, ${w}x${h}, ${(ms / Math.max(1, frames)).toFixed(3)} ms/frame, audio ${audioFrames} stereo frames, framebuffer ${hash}`);
if (stopped !== null) {
  console.log(`engine stopped early: ${stopped}`);
  process.exit(2);
}
if (presented === 0) process.exit(3);
m._CkStop();
await tick();
process.exit(0);
