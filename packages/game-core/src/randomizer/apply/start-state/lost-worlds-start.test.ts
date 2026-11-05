/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CtStartParty } from '../../world/party/ct-party.type';
import { fitStartParty } from './fit-start-party';
import { LOST_WORLDS_START } from './lost-worlds-start.constants';
import { START_BLOCK_MAX_BYTES } from './start-block.constants';
import { startBlocksOf } from './start-blocks-of';
import { EARLY_MAX_BYTES } from './start-split.constants';

const options = { gameMode: 'lost-worlds' };
const PARTIES: readonly CtStartParty[] = [
  ['crono', 'marle'],
  ['lucca', 'robo', 'frog'],
  ['ayla', 'magus', 'frog', 'robo', 'lucca'],
];
const ROSTER: readonly CtStartParty[number][] = ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla', 'magus'];
const SIZED_PARTIES: readonly CtStartParty[] = ROSTER.map((_, i) => ROSTER.slice(0, i + 1));

describe('lost worlds start block', () => {
  it('fits the main block and the early block for parties of 1 to 7 members', { tags: ['critical'] }, () => {
    [...PARTIES, ...SIZED_PARTIES].forEach((party) => {
      const { early, late } = startBlocksOf(LOST_WORLDS_START, fitStartParty(party, options));
      expect(late.length).toBeLessThanOrEqual(START_BLOCK_MAX_BYTES);
      expect(early.length).toBeLessThanOrEqual(EARLY_MAX_BYTES);
    });
  });

  it('lands on the 2300 overworld and keeps the 12K gauge slot open', { tags: ['critical'] }, () => {
    expect(LOST_WORLDS_START.warp.location).toBe(0x1f2);
    expect(LOST_WORLDS_START.pokes.find((poke) => poke.at === 0x7e2881)?.value).toBe(0x1f6);
  });
});
