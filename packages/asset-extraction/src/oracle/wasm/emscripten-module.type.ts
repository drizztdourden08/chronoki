/* @layer shared-asset-extraction @kind types */

interface EmscriptenFs {
  mkdir: (path: string) => void;
  writeFile: (path: string, data: Uint8Array) => void;
  readFile: (path: string) => Uint8Array;
  analyzePath: (path: string) => { exists: boolean };
}

interface EmscriptenModule {
  FS: EmscriptenFs;
  ENV: Record<string, string>;
  callMain: (argv: string[]) => number | undefined | Promise<number | undefined>;
}

interface ModuleOptions {
  print: (line: string) => void;
  printErr: (line: string) => void;
  preRun: (() => void)[];
  ENV?: Record<string, string>;
  instantiateWasm?: (
    imports: WebAssembly.Imports,
    done: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
  ) => unknown;
}

type ModuleFactory = (options: ModuleOptions) => Promise<EmscriptenModule>;

export type { EmscriptenFs, EmscriptenModule, ModuleFactory, ModuleOptions };
