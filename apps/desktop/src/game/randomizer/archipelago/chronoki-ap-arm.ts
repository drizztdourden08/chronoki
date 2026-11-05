/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import { apCall } from './chronoki-ap-calls';
import { chronokiApCurrentSlot } from './chronoki-ap-current-slot';

const CK_SET_AP_ONLINE = 'CkSetApOnline';
const CK_SET_AP_DEATH_LINK = 'CkSetApDeathLink';
const CK_CLEAR_FOREIGN_NAMES = 'CkClearForeignNames';

const chronokiApArm: NonNullable<ArchipelagoGame<unknown, unknown>['arm']> = (connection) => {
  apCall(CK_SET_AP_ONLINE, 1);
  apCall(CK_SET_AP_DEATH_LINK, connection.deathLink ? 1 : 0);
};

const chronokiApDisarm = (): void => {
  apCall(CK_SET_AP_DEATH_LINK, 0);
  apCall(CK_SET_AP_ONLINE, 0);
  apCall(CK_CLEAR_FOREIGN_NAMES);
  chronokiApCurrentSlot.set(-1);
};

export { chronokiApArm, chronokiApDisarm };
