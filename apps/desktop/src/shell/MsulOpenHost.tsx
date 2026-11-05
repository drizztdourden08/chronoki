/* @layer renderer-app @kind component */
import { useMsulOpen } from '@drizztdourden08/brock-msu/renderer';
import { chronokiMsuStore } from '@app/game/msu-studio';

const MsulOpenHost = () => {
  useMsulOpen(chronokiMsuStore());
  return null;
};

export { MsulOpenHost };
