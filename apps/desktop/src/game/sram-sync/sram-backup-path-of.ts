/* @layer bridge-wasm @kind logic */
import { profileDir } from '@drizztdourden08/brock-core/storage';
import { PROFILE_SAVES_DIR, PROFILE_SRAM_BACKUP_FILE } from './sram-sync.constants';

const sramBackupPathOf = (profileId: string): string => `${profileDir(profileId)}/${PROFILE_SAVES_DIR}/${PROFILE_SRAM_BACKUP_FILE}`;

export { sramBackupPathOf };
