/* @layer bridge-wasm @kind logic */
import type { CtStartParty } from '../../world/party/ct-party.type';
import { encodeSetBits } from '../script/encode-set-bits';
import { buildStartBlock } from './build-start-block';
import type { CtStartState } from './ct-start-state.type';
import { INTRO_JUMP, START_BLOCK_MAX_BYTES } from './start-block.constants';
import type { StartBlocks } from './start-blocks.type';
import { splitStartState } from './split-start-state';

const startBlocksOf = (state: CtStartState, party: CtStartParty): StartBlocks => {
  const single = buildStartBlock(state, party, INTRO_JUMP);
  if (single.length <= START_BLOCK_MAX_BYTES) return { early: new Uint8Array(0), late: single };
  const { early, late } = splitStartState(state);
  return {
    early: Uint8Array.from(early.flatMap((flag) => [...encodeSetBits(flag.at, flag.bits)])),
    late: buildStartBlock(late, party, INTRO_JUMP),
  };
};

export { startBlocksOf };
