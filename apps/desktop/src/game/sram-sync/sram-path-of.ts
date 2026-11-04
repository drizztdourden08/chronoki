/* @layer bridge-wasm @kind logic */
import { profileDir } from '@drizztdourden08/brock-core/storage';
import { PROFILE_SAVES_DIR, PROFILE_SRAM_FILE } from './sram-sync.constants';

const sramPathOf = (profileId: string): string => `${profileDir(profileId)}/${PROFILE_SAVES_DIR}/${PROFILE_SRAM_FILE}`;

export { sramPathOf };
