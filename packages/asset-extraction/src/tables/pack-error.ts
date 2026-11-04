/* @layer shared-asset-extraction @kind logic */
class PackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PackError';
  }
}

export { PackError };
