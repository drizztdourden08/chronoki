/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { buildStartBlock } from './build-start-block';
import { fitStartParty } from './fit-start-party';
import { LOST_WORLDS_START } from './lost-worlds-start.constants';
import { INTRO_JUMP, START_BLOCK_MAX_BYTES } from './start-block.constants';

const options = { gameMode: 'lost-worlds' };
const PARTIES: readonly CtStartParty[] = [
  ['crono', 'marle'],
  ['lucca', 'robo', 'frog'],
  ['ayla', 'magus', 'frog', 'robo', 'lucca'],
];

describe('lost worlds start block', () => {
  it('fits the start block for 2, 3 and 5 member parties', { tags: ['critical'] }, () => {
    PARTIES.forEach((party) => {
      const block = buildStartBlock(LOST_WORLDS_START, fitStartParty(party, options), INTRO_JUMP);
      expect(block.length).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
    });
  });

  it('lands on the 2300 overworld and keeps the 12K gauge slot open', { tags: ['critical'] }, () => {
    expect(LOST_WORLDS_START.warp.location).toBe(0x1f2);
    expect(LOST_WORLDS_START.pokes.find((poke) => poke.at === 0x7e2881)?.value).toBe(0x1f6);
  });
});
