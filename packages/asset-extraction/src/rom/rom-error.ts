/* @layer shared-asset-extraction @kind logic */
import type { RomErrorCode } from './rom-error.type';

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
