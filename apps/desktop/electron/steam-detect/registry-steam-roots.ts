/* @layer electron-main @kind logic */
import { execFile } from 'node:child_process';
import { parseRegistryValue } from './parse-registry-value';
import { REGISTRY_QUERIES } from './steam-detect.constants';

const queryValue = (key: string, value: string): Promise<string | null> =>
  new Promise((resolve) => {
    execFile('reg', ['query', key, '/v', value], { windowsHide: true, timeout: 5000 }, (error, stdout) => resolve(error ? null : parseRegistryValue(stdout)));
  });

const registrySteamRoots = async (): Promise<string[]> => {
  if (process.platform !== 'win32') return [];
  const found = await Promise.all(REGISTRY_QUERIES.map(({ key, value }) => queryValue(key, value)));
  return found.filter((path): path is string => path !== null).map((path) => path.replace(/\//g, '\\'));
};

export { registrySteamRoots };
