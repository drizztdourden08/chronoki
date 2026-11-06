/* @layer electron-main @kind logic */
import { join } from 'path';
import { pathToFileURL } from 'url';

const captureRequestPath = (requestUrl: string): string => {
  const [profileId, sessionKey, ...rest] = decodeURIComponent(new URL(requestUrl).pathname.replace(/^\/+/, '')).split('/');
  if (profileId === undefined || sessionKey === undefined) throw new TypeError(`capture request has no profile and session: ${requestUrl}`);
  return join(profileId, sessionKey, ...rest);
};

const captureFilePathOf = (recordingsRoot: string, requestUrl: string): string =>
  join(recordingsRoot, captureRequestPath(requestUrl));

const captureFileUrlOf = (recordingsRoot: string, requestUrl: string): string =>
  pathToFileURL(captureFilePathOf(recordingsRoot, requestUrl)).href;

export { captureFileUrlOf };
