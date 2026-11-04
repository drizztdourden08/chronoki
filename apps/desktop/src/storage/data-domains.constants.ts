/* @layer renderer-app @kind constants */
import type { DataDomainDef } from '@drizztdourden08/brock-core';

const CHRONOKI_DATA_DOMAINS: DataDomainDef[] = [
  { domain: 'profiles', label: 'Profiles', dir: 'profiles', description: 'Each profile with its settings and saves.', clearable: false },
  { domain: 'roms', label: 'ROMs', dir: 'roms', description: 'The game ROMs you imported.', clearable: false },
  { domain: 'msu', label: 'Music packs', dir: 'msu', description: 'MSU-1 and layered music packs, shared by every profile.', clearable: false },
  { domain: 'steam', label: 'Steam data', dir: 'steam', description: 'Margin art built from your own Steam copy of the game; never exported, built again from your copy.', portable: false },
  { domain: 'assets', label: 'Assets', dir: 'assets', description: 'Game assets built from each ROM; built again on demand.' },
  { domain: 'input', label: 'Input', dir: 'input', description: 'Your input profiles and bindings.', clearable: false },
  { domain: 'config', label: 'Config', dir: 'config', description: 'App configuration files.', clearable: false },
  { domain: 'logs', label: 'Logs', dir: 'debug', description: 'Logs and debug captures.', cleanOlderThanDays: [7, 30], portable: false },
];

export { CHRONOKI_DATA_DOMAINS };
