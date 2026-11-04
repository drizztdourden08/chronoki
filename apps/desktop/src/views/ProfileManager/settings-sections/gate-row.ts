/* @layer renderer-components @kind logic */
import { FEATURES_BY_ID } from '@chronoki/features';
import type { SettingsKey } from './settings-sections.type';

const gateRow = (id: string): SettingsKey => ({ key: id, label: FEATURES_BY_ID[id]?.label ?? id, gate: true });

export { gateRow };
