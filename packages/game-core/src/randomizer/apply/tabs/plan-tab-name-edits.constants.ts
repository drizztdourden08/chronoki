/* @layer bridge-wasm @kind constants */
import type { TabKind } from '../../world/tabs/tab-amounts.type';

const TAB_NAME_WHY = 'tab-amount-name';

const TAB_NAME_PREFIX: Readonly<Record<TabKind, string>> = { power: 'Power', magic: 'Magic', speed: 'Speed' };

export { TAB_NAME_PREFIX, TAB_NAME_WHY };
