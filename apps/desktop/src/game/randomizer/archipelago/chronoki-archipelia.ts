/* @layer bridge-wasm @kind logic */
import type { ArchipeliaGame } from '@drizztdourden08/brock-randomizer';
import { AP_WORLD_VERSION, WORLD_MODULE_NAME } from '@chronoki/game-core/archipelago';
import { archipelagoYamlOf } from './archipelago-yaml-of';
import { CHRONOKI_LOBBY_CLIENT } from './chronoki-archipelia.constants';

const chronokiArchipelia: ArchipeliaGame = {
  module: WORLD_MODULE_NAME,
  worldVersion: AP_WORLD_VERSION,
  client: CHRONOKI_LOBBY_CLIENT,
  playerFile: archipelagoYamlOf,
};

export { chronokiArchipelia };
