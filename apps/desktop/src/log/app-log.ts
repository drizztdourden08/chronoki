/* @layer renderer-lib @kind logic */
import { getAppLog } from '@drizztdourden08/brock-react';

const causeText = (cause: unknown): string => {
  if (cause === undefined) return '';
  return `: ${cause instanceof Error ? cause.message : String(cause)}`;
};

const appLog = {
  info: (message: string): void => getAppLog().log('app', message, 'info'),
  warn: (message: string, cause?: unknown): void => getAppLog().log('app', `${message}${causeText(cause)}`, 'warn'),
  error: (message: string, cause?: unknown): void => getAppLog().log('app', `${message}${causeText(cause)}`, 'error'),
};

export { appLog };
