/* @layer shared-asset-extraction @kind logic */
import { spawnSync } from 'node:child_process';
import { JSPI_FLAG } from './import-main.constants';

const respawnWithJspi = (scriptPath: string, args: string[]): number | null => {
  if (process.execArgv.includes(JSPI_FLAG)) return null;
  const result = spawnSync(process.execPath, [JSPI_FLAG, scriptPath, ...args], { stdio: 'inherit', windowsHide: true });
  return result.status ?? 1;
};

export { respawnWithJspi };
