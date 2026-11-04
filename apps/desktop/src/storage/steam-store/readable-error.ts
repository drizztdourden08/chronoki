/* @layer renderer-lib @kind logic */
import { errorMessage } from '../error-message';
import { NOT_ARCHIVE_ERROR } from './steam-store.constants';

const readableError = (err: unknown): string => {
  const message = errorMessage(err);
  return message.includes('ARC1') ? NOT_ARCHIVE_ERROR : message;
};

export { readableError };
