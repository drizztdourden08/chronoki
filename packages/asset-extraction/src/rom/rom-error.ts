/* @layer shared-asset-extraction @kind logic */
type RomErrorCode = 'wrong-size' | 'unknown-rom';

class RomError extends Error {
  readonly code: RomErrorCode;
  readonly sha1: string;
  readonly size: number;

  constructor(code: RomErrorCode, message: string, sha1: string, size: number) {
    super(message);
    this.name = 'RomError';
    this.code = code;
    this.sha1 = sha1;
    this.size = size;
  }
}

export { RomError };
export type { RomErrorCode };
