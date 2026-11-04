/* @layer shared-storage @kind logic */
import { SRAM_FILE } from './save-paths.constants';
import { savesDir } from './saves-dir';

const sramFile = (profile: string): string => `${savesDir(profile)}/${SRAM_FILE}`;

export { sramFile };
