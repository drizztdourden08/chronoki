/* @layer renderer-components @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import type { ArchipelagoFilesSource } from '@drizztdourden08/brock-randomizer/renderer';
import { DEFAULT_AP_VERSION, SUPPORTED_AP_VERSIONS, WORLD_MODULE_NAME } from '@chronoki/game-core/archipelago';
import { archipelagoYamlOf } from '../archipelago/archipelago-yaml-of';

const ctArchipelagoFilesSourceOf = (appVersion: string) => (config: RandomizerProfileConfig): ArchipelagoFilesSource => ({
  apVersion: DEFAULT_AP_VERSION,
  supportedVersions: SUPPORTED_AP_VERSIONS,
  moduleName: WORLD_MODULE_NAME,
  fileOf: () => archipelagoYamlOf(config, appVersion),
});

export { ctArchipelagoFilesSourceOf };
