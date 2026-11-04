/* @layer electron-main @kind logic */
import { win32 } from 'node:path';
import { ARCHIVE_NAME, GAME_PARTS } from './steam-detect.constants';

const archivePathOf = (steamRoot: string): string => win32.join(steamRoot, ...GAME_PARTS, ARCHIVE_NAME);

export { archivePathOf };
