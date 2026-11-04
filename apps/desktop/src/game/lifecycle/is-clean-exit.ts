/* @layer bridge-wasm @kind logic */
const isCleanExit = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && Reflect.get(error, 'name') === 'ExitStatus' && Reflect.get(error, 'status') === 0;

export { isCleanExit };
