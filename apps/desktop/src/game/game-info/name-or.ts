/* @layer bridge-wasm @kind logic */
const nameOr = (name: string | undefined, fallback: string): string =>
  name !== undefined && name !== '' ? name : fallback;

export { nameOr };
