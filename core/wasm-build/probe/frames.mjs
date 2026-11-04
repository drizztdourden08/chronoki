// Probe 1: load the built game module with the reference ct_assets.dat in its file system, run N frames through
// CkRunFrame (the same synchronous call port-kit makes), print frames, ms per frame and a framebuffer hash.
//   node core/wasm-build/probe/frames.mjs [N=600 | --frames N] [--assets <ct_assets.dat>] [--tables <ct_tables.dat>] [--sram <ct_sram.srm>]
// Like port-kit's bootCore: the files are written in Module.preRun and the engine's main runs by itself (INVOKE_RUN=1).
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
  const r = spawnSync(process.execPath, ['--experimental-wasm-jspi', fileURLToPath(import.meta.url), ...process.argv.slice(2)], { stdio: 'inherit', windowsHide: true });
  process.exit(r.status ?? 1);
}

const argValue = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const frames = Number(argValue('--frames', process.argv.slice(2).find((a) => /^\d+$/.test(a)) ?? 600));
const assets = argValue('--assets', 'X:/chronoki-ref/out/ct_assets.dat');
const tables = argValue('--tables', join(dirname(assets), 'ct_tables.dat'));
const sram = argValue('--sram', null);

const glue = join(here, '..', 'out', 'chronoki.js');
if (!existsSync(glue)) {
  console.error('not built: node core/wasm-build/build.mjs');
  process.exit(1);
}
const lines = [];
let stopped = null;
const options = {
  print: (s) => { lines.push(s); console.log(`[engine] ${s}`); },
  printErr: (s) => console.error(`[engine!] ${s}`),
  onExit: (code) => { stopped = code ?? 0; },
  onAbort: (what) => { stopped = `abort: ${what}`; },
  preRun: [() => {
    const fs = options.FS;
    fs.writeFile('/ct_assets.dat', readFileSync(assets));
    if (existsSync(tables)) fs.writeFile('/ct_tables.dat', readFileSync(tables));
    fs.writeFile('/ct_settings.ini', '');
    fs.mkdir('/saves');
    if (sram) fs.writeFile('/saves/ct_sram.srm', readFileSync(sram));
  }],
};
const m = await createRequire(import.meta.url)(glue)(options);

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
// where main sits: parked at a present (ckWake set), or waiting on the sound coroutine (ck_coro_js_resume's promise)
const coros = [...(m.ckCoros ?? new Map()).values()].map((s, i) =>
  `coro ${i}: started ${s.started}, resumes ${s.switches ?? '?'}, suspended ${!!s.toCoro}, resumer waiting ${!!s.toCaller}, dead ${s.dead ? String(s.dead).split('\n')[0] : 'no'}`);
console.log(`main parked at a present: ${typeof m.ckWake === 'function'}; ${coros.length ? coros.join('; ') : 'no coroutine'}`);
if (stopped !== null) {
  console.log(`engine stopped early: ${stopped}`);
  process.exit(2);
}
if (presented === 0) process.exit(3);
m._CkStop();
await tick();
process.exit(0);
