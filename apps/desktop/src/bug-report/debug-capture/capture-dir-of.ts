/* @layer renderer-lib @kind logic */
import { CAPTURE_DIR } from './debug-capture.constants';

const captureDirOf = (profileId: string): string => `${CAPTURE_DIR}/${profileId}`;

export { captureDirOf };
