/* @layer shared-asset-extraction @kind types */

/** The part of Emscripten's MEMFS the driver uses. */
interface EmscriptenFs {
  mkdir: (path: string) => void;
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
  analyzePath: (path: string) => { exists: boolean };
}

/** The part of an Emscripten module (built with INVOKE_RUN=0, EXPORTED_RUNTIME_METHODS=callMain,FS,ENV) the driver uses. */
interface EmscriptenModule {
  FS: EmscriptenFs;
  ENV: Record<string, string>;
  callMain: (argv: string[]) => number | undefined | Promise<number | undefined>;
}

/**
 * What the driver passes to the factory: Emscripten's own Module options object. A MODULARIZE factory uses that very
 * object as the module, so `ENV` is filled in by the runtime and readable from `preRun` (as probe/oracle.mjs does).
 */
interface ModuleOptions {
  print: (line: string) => void;
  printErr: (line: string) => void;
  /** Runs before the C runtime starts; the environment is set here, libc reads it once at start-up. */
  preRun: (() => void)[];
  ENV?: Record<string, string>;
  /** Present when the driver reuses a compiled WebAssembly.Module. */
  instantiateWasm?: (
    imports: WebAssembly.Imports,
    done: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
  ) => unknown;
}

/** The module factory (`ChronoKiOracle` of chronoki-oracle.js); Electron main and the browser each supply theirs. */
type ModuleFactory = (options: ModuleOptions) => Promise<EmscriptenModule>;

export type { EmscriptenFs, EmscriptenModule, ModuleFactory, ModuleOptions };
