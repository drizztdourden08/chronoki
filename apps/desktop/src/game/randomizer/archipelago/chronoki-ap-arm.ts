/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import { apCall } from './ap-call';
import { CK_SET_AP_ONLINE } from './chronoki-ap-arm.constants';
import { CK_SET_AP_DEATH_LINK } from './chronoki-ap-death-link.constants';

const chronokiApArm: NonNullable<ArchipelagoGame<unknown, unknown>['arm']> = (connection) => {
  apCall(CK_SET_AP_ONLINE, 1);
  apCall(CK_SET_AP_DEATH_LINK, connection.deathLink ? 1 : 0);
};

export { chronokiApArm };
