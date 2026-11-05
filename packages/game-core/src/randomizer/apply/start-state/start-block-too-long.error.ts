/* @layer bridge-wasm @kind logic */
class StartBlockTooLongError extends Error {
  constructor(readonly length: number, readonly limit: number) {
    super(`This starting party needs a ${length}-byte start block; scene 0 only has room for ${limit}. Use a smaller party.`);
    this.name = 'StartBlockTooLongError';
  }
}

export { StartBlockTooLongError };
