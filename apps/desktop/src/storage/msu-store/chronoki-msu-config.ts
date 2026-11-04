/* @layer renderer-lib @kind constants */
import { defineMsuGame } from '@drizztdourden08/brock-msu';
import { MSU_PACK_ROOT } from './msu-store.constants';

const chronokiMsuConfig = defineMsuGame({
  id: 'chronoki',
  packRoot: MSU_PACK_ROOT,
  soundChannels: [],
  soundIdCount: 0,
  trackLoops: () => true,
  classifyMusic: () => ({ kind: 'ignore' }),
  resumePath: (profile, slotKind, slotId) => `profiles/${profile}/saves/${slotKind}-${slotId}.msu.json`,
});

export { chronokiMsuConfig };
