/* @layer shared @kind logic */
import { VANILLA_SAFE_LOCKED_SETTINGS } from './vanilla-safe-locked-settings.constants';

const isVanillaSafeLockedSetting = (key: string): boolean => VANILLA_SAFE_LOCKED_SETTINGS.has(key);

export { isVanillaSafeLockedSetting };
