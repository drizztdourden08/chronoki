/* @layer shared-asset-extraction @kind logic */
/** pack_tables.py PackError: a header the packer does not understand is an error, never a guess. */
class PackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PackError';
  }
}

export { PackError };
