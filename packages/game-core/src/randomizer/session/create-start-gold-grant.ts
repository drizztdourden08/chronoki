/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { GOLD } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { GOLD_BYTES, GOLD_WAIT_MAX_POLLS } from './session.constants';
import type { StartGoldGrant, WramWrite } from './start-gold-grant.type';

const goldBytes = (gold: number): Uint8Array =>
  Uint8Array.from({ length: GOLD_BYTES }, (_, i) => Math.floor(gold / 256 ** i) % 256);

const readGold = (view: MemoryView): number[] =>
  Array.from({ length: GOLD_BYTES }, (_, i) => view.byte(CT_WRAM_REGION, GOLD + i));

const createStartGoldGrant = (write: WramWrite, gold: number): StartGoldGrant => {
  let granted = false;
  let polls = 0;
  const wanted = [...goldBytes(gold)];
  return {
    observe: (started, view) => {
      if (granted || !started) return granted;
      polls += 1;
      if (readGold(view).every((b) => b === 0) && polls < GOLD_WAIT_MAX_POLLS) return false;
      granted = write(GOLD, goldBytes(gold)) && readGold(view).every((b, i) => b === wanted[i]);
      return granted;
    },
    granted: () => granted,
    reset: () => {
      granted = false;
      polls = 0;
    },
  };
};

export { createStartGoldGrant };
