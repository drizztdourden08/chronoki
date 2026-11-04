// Builds ChronoKi's two WebAssembly modules with emcc (the emsdk RotP uses), data-free: no ROM, no asset, no table is
// embedded; the shell puts /ct_assets.dat (and /ct_tables.dat) in the core's file system before it starts the engine.
//   node core/wasm-build/build.mjs [--only game|oracle] [--emsdk <dir>] [--debug]
// Output (git-ignored): core/wasm-build/out/chronoki-core.{js,wasm}  (factory ChronoKiCore, the game: JSPI)
//                       core/wasm-build/out/chronoki-oracle.{js,wasm} (factory ChronoKiOracle, the full ct tool: JSPI)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeShapes } from './shapes.mjs';
import { belthasar, ctSources, gameSources, hostSources, reconnectSources, root } from './sources.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'out');
const isWin = process.platform === 'win32';

const argValue = (name) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
};
const only = argValue('--only');
const debug = process.argv.includes('--debug');

const findEmsdk = () => {
  const candidates = [
    argValue('--emsdk'),
    process.env.CHRONOKI_EMSDK,
    process.env.EMSDK,
    join(root, 'third_party', 'emsdk'),
    join(root, '..', '..', '..', 'third_party', 'emsdk'),
    'X:/relic-of-the-past/third_party/emsdk',
  ].filter(Boolean);
  return candidates.map((c) => resolve(c)).find((c) => existsSync(join(c, 'upstream', 'emscripten')));
};

// emsdk_env without running a shell script: the same PATH and variables, set inline
const emsdkEnv = (emsdk) => {
  const sub = (dir) => {
    const d = join(emsdk, dir);
    return existsSync(d) ? readdirSync(d).map((v) => join(d, v)) : [];
  };
  const node = sub('node');
  const python = sub('python');
  const extra = [
    emsdk,
    join(emsdk, 'upstream', 'emscripten'),
    ...node.flatMap((n) => [n, join(n, 'bin')]),
    ...python.flatMap((p) => [p, join(p, 'bin')]),
  ].filter(existsSync);
  const env = { ...process.env };
  const pathKey = Object.keys(env).find((k) => k.toLowerCase() === 'path') ?? 'PATH';
  env[pathKey] = [...extra, env[pathKey] ?? ''].join(delimiter);
  env.EMSDK = emsdk;
  if (node[0]) env.EMSDK_NODE = join(node[0], isWin ? 'node.exe' : 'bin/node');
  if (python[0]) env.EMSDK_PYTHON = join(python[0], isWin ? 'python.exe' : 'bin/python3');
  if (existsSync(join(emsdk, '.emscripten'))) env.EM_CONFIG = join(emsdk, '.emscripten');
  return env;
};

const emcc = (args, env) => {
  const rspDir = mkdtempSync(join(tmpdir(), 'chronoki-emcc-'));
  const rsp = join(rspDir, 'args.rsp.utf-8');
  const escapeArg = (a) => {
    const escaped = a.replace(/[\\"']/g, (c) => `\\${c}`);
    return escaped.includes(' ') ? `"${escaped}"` : escaped;
  };
  writeFileSync(rsp, `${args.map((a) => escapeArg(a.replace(/\\/g, '/'))).join('\n')}\n`);
  const cmd = isWin ? process.env.COMSPEC || 'cmd.exe' : 'emcc';
  const spawnArgs = isWin ? ['/c', 'emcc', `@${rsp}`] : [`@${rsp}`];
  const result = spawnSync(cmd, spawnArgs, { stdio: 'inherit', env });
  rmSync(rspDir, { recursive: true, force: true });
  return result.status ?? 1;
};

const abs = (rel) => join(belthasar, rel);
const common = [debug ? '-O0' : '-O2', debug ? '-g' : '-g0', '-w', '-fno-strict-aliasing'];

const gameArgs = (gen) => [
  ...common,
  '-DCT_DATAFREE', '-DCT_XLAT_NO_GWARP', '-DCT_AUDIO_SPC_DEFAULT=1',
  '-I', abs('src'), '-I', abs('snes'), '-I', join(root, 'core', 'reconnect'), '-I', abs('src/tables'), '-I', gen.dir,
  ...gameSources().map(abs),
  ...gen.gameFiles,
  ...reconnectSources,
  ...hostSources,
  '-o', join(outDir, 'chronoki-core.js'),
  // JSPI: field.c's blocking main() suspends at each present (ck_loop.c); the sound program's coroutine is a JSPI
  // stack of its own, entered through ck_coro_entry (reconnect/coro_wasm.c)
  '-sJSPI', '-sJSPI_EXPORTS=main,ck_coro_entry',
  '-sINVOKE_RUN=0',            // the shell fills the file system first, then calls callMain
  '-sMODULARIZE=1', '-sEXPORT_NAME=ChronoKiCore', '-sENVIRONMENT=web,worker,node',
  '-sFORCE_FILESYSTEM=1', '-sALLOW_MEMORY_GROWTH=1', '-sINITIAL_MEMORY=268435456', '-sMAXIMUM_MEMORY=1073741824',
  '-sSTACK_SIZE=8388608',
  '-sEXPORTED_FUNCTIONS=_main,_malloc,_free,_CkStop,_CkSetPaused,_CkRunFrame,_CkSetInput,_CkSaveSram,_CkSaveState,_CkLoadState,_CkFramePtr,_CkFrameWidth,_CkFrameHeight,_CkFrameCount,_CkSamplesPtr,_CkSampleCount,_ck_coro_entry',
  '-sEXPORTED_RUNTIME_METHODS=ccall,cwrap,callMain,FS,ENV,HEAPU8,HEAP16,HEAP32',
  '-lm',
];

// The full ct tool (the importer's ct.exe, docs/p3-findings.md): ct's own source list, the game's data-free table storage
// (shapes.mjs) and the reconnect layer's coroutine. JSPI as the game's: the sound machine's coroutine (--sndtiming)
// suspends inside main, so callMain returns a Promise.
const oracleArgs = (gen) => [
  ...common,
  '-DCT_DATAFREE', '-DCT_XLAT_NO_GWARP',
  '-I', abs('snes'), '-I', abs('src'), '-I', join(root, 'core', 'reconnect'), '-I', abs('src/tables'), '-I', gen.dir,
  ...ctSources().map(abs),
  ...gen.gameFiles,
  join(here, 'xlat_stubs.c'),
  join(root, 'core', 'reconnect', 'coro_wasm.c'),
  '-o', join(outDir, 'chronoki-oracle.js'),
  '-sJSPI', '-sJSPI_EXPORTS=main,ck_coro_entry',
  '-sINVOKE_RUN=0', '-sEXIT_RUNTIME=1',
  '-sMODULARIZE=1', '-sEXPORT_NAME=ChronoKiOracle', '-sENVIRONMENT=node,web,worker',
  '-sFORCE_FILESYSTEM=1', '-sALLOW_MEMORY_GROWTH=1', '-sINITIAL_MEMORY=134217728', '-sSTACK_SIZE=8388608',
  '-sEXPORTED_FUNCTIONS=_main,_malloc,_free,_ck_coro_entry',
  '-sEXPORTED_RUNTIME_METHODS=callMain,FS,ENV',
  '-lm',
];

const main = () => {
  if (!existsSync(join(belthasar, 'CMakeLists.txt'))) {
    console.error('core/belthasar is not imported (pnpm core:import first)');
    process.exit(1);
  }
  const emsdk = findEmsdk();
  const haveEmccOnPath = !emsdk && spawnSync(isWin ? 'where' : 'which', ['emcc'], { stdio: 'ignore' }).status === 0;
  if (!emsdk && !haveEmccOnPath) {
    console.error('emcc not found: pass --emsdk <dir> (or set CHRONOKI_EMSDK), or put emcc on PATH');
    process.exit(1);
  }
  const env = emsdk ? emsdkEnv(emsdk) : process.env;
  console.log(`emsdk: ${emsdk ?? '(emcc on PATH)'}`);
  mkdirSync(outDir, { recursive: true });
  const gen = writeShapes(outDir);
  if (!gen.tables32) console.log('note: no out/tables32/tables_storage.c; the imported 64-bit table storage is used (docs/p3-findings.md)');
  const jobs = [];
  if (only !== 'oracle') jobs.push(['game', gameArgs(gen)]);
  if (only !== 'game') jobs.push(['oracle', oracleArgs(gen)]);
  for (const [name, args] of jobs) {
    console.log(`building ${name}...`);
    const status = emcc(args, env);
    if (status !== 0) {
      console.error(`\nBUILD FAILED (${name})`);
      process.exit(status);
    }
  }
  writeFileSync(join(outDir, 'package.json'), `${JSON.stringify({ type: 'commonjs' })}\n`);
  console.log('done: core/wasm-build/out/');
};

main();
