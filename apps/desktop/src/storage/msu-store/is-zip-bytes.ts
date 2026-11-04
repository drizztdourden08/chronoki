/* @layer renderer-lib @kind logic */
import { ZIP_MAGIC } from './msu-store.constants';

const isZipBytes = (bytes: Uint8Array): boolean => bytes[0] === ZIP_MAGIC[0] && bytes[1] === ZIP_MAGIC[1];

export { isZipBytes };
