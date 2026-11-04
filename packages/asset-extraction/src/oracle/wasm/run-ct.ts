/* @layer shared-asset-extraction @kind logic */
import type { CtInvocation, CtOutcome } from './ct-invocation.type';
import type { EmscriptenFs, ModuleFactory, ModuleOptions } from './emscripten-module.type';

const ensureDir = (fs: EmscriptenFs, dir: string): void => {
  let at = '';
  for (const part of dir.split('/').filter(Boolean)) {
    at += `/${part}`;
    if (!fs.analyzePath(at).exists) fs.mkdir(at);
  }
};

const statusOf = (error: unknown): number => {
  const status = (error as { status?: unknown } | null)?.status;
  if (typeof status === 'number') return status;
  throw error;
};

const runCt = async (
  factory: ModuleFactory,
  invocation: CtInvocation,
  instantiateWasm?: ModuleOptions['instantiateWasm'] | undefined,
): Promise<CtOutcome> => {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const options: ModuleOptions = {
    print: (line) => stdout.push(line),
    printErr: (line) => stderr.push(line),
    preRun: [() => Object.assign(options.ENV as Record<string, string>, invocation.env)],
    ...(instantiateWasm ? { instantiateWasm } : {}),
  };
  const module = await factory(options);
  for (const [path, data] of Object.entries(invocation.files)) {
    ensureDir(module.FS, path.slice(0, path.lastIndexOf('/')));
    module.FS.writeFile(path, data);
  }
  for (const path of invocation.outputs) ensureDir(module.FS, path.slice(0, path.lastIndexOf('/')));
  let status = 0;
  try {
    status = (await module.callMain(invocation.argv)) ?? 0;
  } catch (error) {
    status = statusOf(error);
  }
  const files: Record<string, Uint8Array> = {};
  for (const path of invocation.outputs) {
    if (module.FS.analyzePath(path).exists) files[path] = module.FS.readFile(path);
  }
  return { status, stdout, stderr, files };
};

export { runCt };
