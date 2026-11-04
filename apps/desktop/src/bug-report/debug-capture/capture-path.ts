/* @layer renderer-lib @kind logic */
import { captureDirOf } from './capture-dir-of';

const capturePathOf = (profileId: string, sessionKey: string): string => `${captureDirOf(profileId)}/${sessionKey}.json`;

export { capturePathOf };
