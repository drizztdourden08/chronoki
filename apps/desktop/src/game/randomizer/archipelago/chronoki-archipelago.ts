/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import type { CtPlacement } from '@chronoki/game-core';
import { AP_GAME, AP_WORLD_VERSION } from '@chronoki/game-core/archipelago';
import { chronokiApArm, chronokiApDisarm } from './chronoki-ap-arm';
import { chronokiApMarkCollected } from './chronoki-ap-collected';
import { chronokiApDeathLink } from './chronoki-ap-death-link';
import { chronokiApFile } from './chronoki-ap-file';
import { chronokiApGoal } from './chronoki-ap-goal';
import { chronokiApLocationIdOf, chronokiApLocationKeyOf } from './chronoki-ap-ids';
import { chronokiApReceivedAction } from './chronoki-ap-received-action';
import { chronokiApSlot } from './chronoki-ap-slot';
import { chronokiArchipelia } from './chronoki-archipelia';

const chronokiArchipelago: ArchipelagoGame<CtPlacement, unknown> = {
  name: AP_GAME,
  worldVersion: AP_WORLD_VERSION,
  archipelia: chronokiArchipelia,
  locationKeyOf: chronokiApLocationKeyOf,
  locationIdOf: chronokiApLocationIdOf,
  slot: chronokiApSlot,
  receivedAction: chronokiApReceivedAction,
  get goal() {
    return chronokiApGoal();
  },
  deathLink: chronokiApDeathLink,
  file: chronokiApFile,
  markCollected: chronokiApMarkCollected,
  arm: chronokiApArm,
  disarm: chronokiApDisarm,
};

export { chronokiArchipelago };
