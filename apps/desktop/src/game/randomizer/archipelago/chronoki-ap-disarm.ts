/* @layer bridge-wasm @kind logic */
import { apCall } from './ap-call';
import { CK_SET_AP_ONLINE } from './chronoki-ap-arm.constants';
import { CK_SET_AP_DEATH_LINK } from './chronoki-ap-death-link.constants';
import { CK_CLEAR_FOREIGN_NAMES } from './chronoki-ap-foreign-names.constants';
import { chronokiApCurrentSlot } from './chronoki-ap-current-slot';

const chronokiApDisarm = (): void => {
  apCall(CK_SET_AP_DEATH_LINK, 0);
  apCall(CK_SET_AP_ONLINE, 0);
  apCall(CK_CLEAR_FOREIGN_NAMES);
  chronokiApCurrentSlot.set(-1);
};

export { chronokiApDisarm };
