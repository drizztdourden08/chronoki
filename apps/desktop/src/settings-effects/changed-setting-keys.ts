/* @layer renderer-app @kind logic */
import { GATE_KEY_PREFIX } from '@app/settings-controls/gate-keys.constants';
import type { AppSettings } from '@app/settings.type';

const changedGateKeys = (prev: AppSettings, next: AppSettings): string[] => {
  const ids = new Set([...Object.keys(prev.gates), ...Object.keys(next.gates)]);
  return [...ids].filter((id) => prev.gates[id] !== next.gates[id]).map((id) => `${GATE_KEY_PREFIX}${id}`);
};

const changedSettingKeys = (prev: AppSettings, next: AppSettings): string[] =>
  (Object.keys(next) as (keyof AppSettings)[])
    .filter((key) => prev[key] !== next[key])
    .flatMap((key) => (key === 'gates' ? changedGateKeys(prev, next) : [key]));

export { changedSettingKeys };
